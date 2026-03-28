import { NextResponse } from "next/server";
import { getLeadMagnetSettings, markSubscriberFailure, sendLeadMagnetEmail, upsertSubscriber } from "@/lib/lead-magnet-store";
import { trackEvent } from "@/lib/analytics-store";
import { localizeText } from "@/lib/localized";

const blockedDomains = new Set(["mailinator.com", "tempmail.com", "10minutemail.com"]);

function validEmail(email: string) {
  const parsed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed)) return false;
  const domain = parsed.split("@")[1];
  if (!domain) return false;
  return !blockedDomains.has(domain);
}

function getIpAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
}

function asPublicText(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export async function GET() {
  const settings = await getLeadMagnetSettings();
  const publicPayload = {
    isActive: Boolean(settings.isActive),
    publicTitle: asPublicText(localizeText(settings.publicTitle, undefined, ""), "Get the Freelancer Protection Checklist"),
    publicDescription: asPublicText(localizeText(settings.publicDescription, undefined, ""), "A concise pre-client checklist to avoid weak terms, vague scope, and payment friction."),
    buttonLabel: asPublicText(localizeText(settings.buttonLabel, undefined, ""), "Send me the checklist"),
    successMessage: asPublicText(localizeText(settings.successMessage, undefined, ""), "You're in — check your inbox for your resources.")
  };

  return NextResponse.json({
    ...publicPayload
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; source?: string; company?: string };
  const email = (body.email || "").trim().toLowerCase();

  if (body.company) return NextResponse.json({ ok: true, message: "Submission received." });

  if (!validEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const settings = await getLeadMagnetSettings();
  if (!settings.isActive) {
    return NextResponse.json({ ok: false, error: "Lead magnet delivery is currently paused." }, { status: 503 });
  }

  const { subscriber, duplicate } = await upsertSubscriber({
    email,
    source: body.source || "lead_capture",
    leadMagnetId: settings.id,
    userAgent: request.headers.get("user-agent") || "",
    ipAddress: getIpAddress(request)
  });

  if (duplicate && !settings.resendOnDuplicate) {
    return NextResponse.json({ ok: true, message: localizeText(settings.successMessage, undefined, settings.successMessage), duplicate: true });
  }

  try {
    await sendLeadMagnetEmail(email, subscriber.id);
    await trackEvent("lead_opt_in", settings.slug || settings.id);
    return NextResponse.json({ ok: true, message: localizeText(settings.successMessage, undefined, settings.successMessage), duplicate });
  } catch (error) {
    await markSubscriberFailure(subscriber.id, error instanceof Error ? error.message : "Email delivery failed");
    return NextResponse.json({ ok: false, error: "We captured your request, but email delivery failed. Please try again shortly." }, { status: 500 });
  }
}
