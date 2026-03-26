import { NextResponse } from "next/server";
import { authenticateUser, getCurrentUser, updateUser } from "@/lib/user-store";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as { currentPassword?: string; newPassword?: string };
  if (!body.currentPassword || !body.newPassword || body.newPassword.length < 8) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const valid = await authenticateUser(user.username, body.currentPassword);
  if (!valid) return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });

  await updateUser(user.id, { password: body.newPassword });
  return NextResponse.json({ ok: true });
}
