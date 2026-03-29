import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/server";
import { authenticateUser, ensureDefaultAdmin } from "@/lib/user-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requireSameOrigin } from "@/lib/security";

export async function POST(req: Request) {
  await ensureDefaultAdmin();
  await requireSameOrigin(req);

  const rate = checkRateLimit(`signin:${getClientIp(req)}`, 12, 10 * 60 * 1000);
  if (!rate.ok) return NextResponse.json({ message: "Too many attempts" }, { status: 429 });

  const body = (await req.json()) as { username?: string; password?: string };
  if (!body.username || !body.password || body.password.length < 10) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
  }
  const user = await authenticateUser(body.username, body.password);
  if (!user) return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ role: user.role });
}
