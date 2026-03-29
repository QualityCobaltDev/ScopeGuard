import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { authenticateUser } from "@/lib/user-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requireSameOrigin } from "@/lib/security";

export async function POST(req: Request) {
  try {
    await requireSameOrigin(req);
    const key = `admin-login:${getClientIp(req)}`;
    const rate = checkRateLimit(key, 10, 10 * 60 * 1000);
    if (!rate.ok) {
      return NextResponse.json({ ok: false, message: "Too many login attempts" }, { status: 429 });
    }

    const body = (await req.json()) as { username?: string; password?: string };
    const user = body.username && body.password ? await authenticateUser(body.username, body.password) : null;

    if (!user || !["owner", "admin"].includes(user.role)) {
      return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }
}
