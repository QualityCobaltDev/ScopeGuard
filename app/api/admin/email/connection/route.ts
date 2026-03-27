import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { verifySmtpConnection } from "@/lib/email";

export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await verifySmtpConnection();
    return NextResponse.json({ ok: true, message: "Connection verified successfully." });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to connect to the SMTP server. Please review host, port, SSL, username, and password." },
      { status: 500 }
    );
  }
}
