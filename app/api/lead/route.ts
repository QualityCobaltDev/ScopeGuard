import { NextResponse } from "next/server";
import { getLeadMagnetSettings, markSubscriberFailure, sendLeadMagnetEmail, upsertSubscriber } from "@/lib/lead-magnet-store";
import { trackEvent } from "@/lib/analytics-store";
import { isLocale } from "@/lib/i18n";
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


export async function GET() {
  const settings = await getLeadMagnetSettings();
  return NextResponse.json({
    isActive: settings.isActive,
    publicTitle: settings.publicTitle,
    publicDescription: settings.publicDescription,
    buttonLabel: settings.buttonLabel,
    successMessage: settings.successMessage
  });
}

export async function POST(request: Request) {
  const localeCookie = request.headers.get("cookie")?.split("; ").find((entry) => entry.startsWith("scopeguard-locale="))?.split("=")[1];
  const locale = isLocale(localeCookie) ? localeCookie : "en";
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
    return NextResponse.json({ ok: true, message: localizeText(settings.successMessage as any, locale, settings.successMessage), duplicate: true });
  }

  try {
    await sendLeadMagnetEmail(email, subscriber.id);
    await trackEvent("lead_opt_in", settings.slug || settings.id);
    return NextResponse.json({ ok: true, message: localizeText(settings.successMessage as any, locale, settings.successMessage), duplicate });
  } catch (error) {
    await markSubscriberFailure(subscriber.id, error instanceof Error ? error.message : "Email delivery failed");
    return NextResponse.json({ ok: false, error: "We captured your request, but email delivery failed. Please try again shortly." }, { status: 500 });
  }
}
