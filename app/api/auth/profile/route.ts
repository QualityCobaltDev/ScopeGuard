import { NextResponse } from "next/server";
import { getCurrentUser, updateUser } from "@/lib/user-store";

export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as { name?: string };
  if (!body.name || body.name.length < 2) return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  const updated = await updateUser(user.id, { name: body.name });
  return NextResponse.json(updated);
}
