import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { ContentPost, readPosts, writePosts } from "@/lib/cms-store";
import { revalidateSiteContent } from "@/lib/site-sync";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await readPosts());
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { payload?: ContentPost[] };
  const payload = (body.payload || []).map((item): ContentPost => ({
    ...item,
    id: item.id || randomUUID(),
    updatedAt: new Date().toISOString(),
    createdAt: item.createdAt || new Date().toISOString()
  }));
  await writePosts(payload);
  await revalidateSiteContent();
  return NextResponse.json({ ok: true });
}
