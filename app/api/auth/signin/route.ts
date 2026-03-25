import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { authenticateUser, ensureDefaultAdmin } from "@/lib/user-store";

export async function POST(req: Request) {
  await ensureDefaultAdmin();
  const body = (await req.json()) as { email?: string; password?: string };
  if (!body.email?.includes("@") || !body.password || body.password.length < 8) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }
  const user = await authenticateUser(body.email, body.password);
  if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ role: user.role });
}
