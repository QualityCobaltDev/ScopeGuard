import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };

  if (!body.email || !body.email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Lead captured" });
}
