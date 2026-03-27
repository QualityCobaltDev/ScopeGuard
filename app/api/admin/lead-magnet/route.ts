import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { getLeadMagnetResources, getLeadMagnetSettings, leadMagnetMetrics, saveLeadMagnetSettings } from "@/lib/lead-magnet-store";
import { readCollection } from "@/lib/content-store";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [settings, resources, metrics, attached] = await Promise.all([
    getLeadMagnetSettings(),
    readCollection("resources"),
    leadMagnetMetrics(),
    getLeadMagnetResources()
  ]);

  return NextResponse.json({ settings, resources, attached, metrics });
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const next = await saveLeadMagnetSettings({
    name: String(body.name || "Freelancer Checklist"),
    slug: String(body.slug || "freelancer-protection-checklist"),
    publicTitle: String(body.publicTitle || "Get the Freelancer Protection Checklist"),
    publicDescription: String(body.publicDescription || ""),
    buttonLabel: String(body.buttonLabel || "Send me the checklist"),
    successMessage: String(body.successMessage || "You're in — check your inbox."),
    emailSubject: String(body.emailSubject || "Your Freelancer Protection Checklist is here"),
    emailPreviewText: String(body.emailPreviewText || ""),
    emailIntro: String(body.emailIntro || ""),
    emailClosing: String(body.emailClosing || ""),
    senderName: body.senderName ? String(body.senderName) : undefined,
    senderEmail: body.senderEmail ? String(body.senderEmail) : undefined,
    replyToEmail: body.replyToEmail ? String(body.replyToEmail) : undefined,
    isActive: Boolean(body.isActive ?? true),
    resendOnDuplicate: Boolean(body.resendOnDuplicate ?? true),
    sendAdminNotification: Boolean(body.sendAdminNotification ?? false),
    selectedResourceIds: Array.isArray(body.selectedResourceIds) ? body.selectedResourceIds.map((item) => String(item)) : [],
    primaryResourceId: body.primaryResourceId ? String(body.primaryResourceId) : undefined
  });

  return NextResponse.json({ ok: true, message: "Lead magnet settings saved.", settings: next });
}
