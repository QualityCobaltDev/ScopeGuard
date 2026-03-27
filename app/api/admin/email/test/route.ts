import { NextResponse } from "next/server";
import { sendMail, verifySmtpConnection } from "@/lib/email";
import { requireAdmin } from "@/lib/permissions";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { to?: string };
  const to = body.to?.trim();
  if (!to || !to.includes("@")) return NextResponse.json({ message: "Valid recipient is required" }, { status: 400 });

  try {
    await verifySmtpConnection();
    await sendMail({
      to,
      subject: "ScopeGuard SMTP test",
      text: "SMTP test successful for ScopeGuard admin dashboard.",
      html: "<p>SMTP test successful for <strong>ScopeGuard admin dashboard</strong>.</p>"
    });
    return NextResponse.json({ ok: true, message: `Test email sent to ${to}` });
  } catch {
    return NextResponse.json({ ok: false, message: "SMTP verification or sending failed." }, { status: 500 });
  }
}
