import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { getEmailSettingsForAdmin, updateEmailSettings } from "@/lib/email-settings-store";

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await getEmailSettingsForAdmin());
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  let user;
  try {
    user = await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    smtpHost?: string;
    smtpPort?: number;
    smtpSecure?: boolean;
    smtpUser?: string;
    smtpPassword?: string;
    clearPassword?: boolean;
    senderEmail?: string;
    senderName?: string;
    replyToEmail?: string;
    defaultTestRecipient?: string;
    isActive?: boolean;
  };

  const host = String(body.smtpHost || "").trim();
  const port = Number(body.smtpPort);
  const userName = String(body.smtpUser || "").trim();
  const senderEmail = String(body.senderEmail || "").trim();
  const senderName = String(body.senderName || "ScopeGuard").trim();
  const defaultTestRecipient = String(body.defaultTestRecipient || "").trim();
  const replyTo = String(body.replyToEmail || "").trim();

  if (!host || !port || port < 1 || port > 65535) {
    return NextResponse.json({ message: "Please provide a valid SMTP host and port." }, { status: 400 });
  }

  if (!validEmail(userName) || !validEmail(senderEmail) || !validEmail(defaultTestRecipient) || (replyTo && !validEmail(replyTo))) {
    return NextResponse.json({ message: "Please check SMTP user/sender/test recipient email addresses." }, { status: 400 });
  }

  await updateEmailSettings(
    {
      smtpHost: host,
      smtpPort: port,
      smtpSecure: Boolean(body.smtpSecure),
      smtpUser: userName,
      smtpPassword: body.smtpPassword,
      clearPassword: Boolean(body.clearPassword),
      senderEmail,
      senderName,
      replyToEmail: replyTo || undefined,
      defaultTestRecipient,
      isActive: Boolean(body.isActive ?? true)
    },
    user.username
  );

  return NextResponse.json({ ok: true, message: "SMTP settings saved successfully." });
}
