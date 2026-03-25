import { NextResponse } from "next/server";
import { createAdminSession, getExpectedCredentials } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { username?: string; password?: string };
  const { username, password } = getExpectedCredentials();

  if (body.username !== username || body.password !== password) {
    return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
