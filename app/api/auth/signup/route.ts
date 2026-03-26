import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { createUser, ensureDefaultAdmin } from "@/lib/user-store";

export async function POST(req: Request) {
  await ensureDefaultAdmin();
  const body = (await req.json()) as { username?: string; name?: string; password?: string };
  if (!body.username || body.username.length < 4 || !body.name || body.name.length < 2 || !body.password || body.password.length < 8) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
  try {
    const user = await createUser({ username: body.username, name: body.name, password: body.password });
    await createSession(user.id);
    return NextResponse.json({ role: user.role });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to sign up" }, { status: 400 });
  }
}
