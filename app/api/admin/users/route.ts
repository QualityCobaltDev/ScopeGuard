import { NextResponse } from "next/server";
import { createUser, deleteUser, listUsers, updateUser } from "@/lib/user-store";
import { requireAdmin } from "@/lib/permissions";

function sanitizeUser<T extends { passwordHash?: string }>(user: T) {
  const safe = { ...user };
  delete safe.passwordHash;
  return safe;
}

export async function GET() {
  try {
    await requireAdmin();
    const users = await listUsers();
    return NextResponse.json(users.map((user) => sanitizeUser(user)));
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as { username?: string; name?: string; password?: string; role?: "admin" | "user" };
    if (!body.username || body.username.length < 4 || !body.name || !body.password || body.password.length < 8 || !body.role) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }
    const created = await createUser({ username: body.username, name: body.name, password: body.password, role: body.role });
    return NextResponse.json(sanitizeUser(created));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unauthorized" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as { id?: string; username?: string; name?: string; role?: "admin" | "user"; active?: boolean; password?: string };
    if (!body.id) return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    const updated = await updateUser(body.id, body);
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(sanitizeUser(updated));
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as { id?: string };
    if (!body.id) return NextResponse.json({ message: "id required" }, { status: 400 });
    await deleteUser(body.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
