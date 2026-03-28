import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { deletePageById, readPages, syncNavigationFromPages, writePages } from "@/lib/cms-store";
import { revalidateSiteContent } from "@/lib/site-sync";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await readPages());
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

  const body = (await request.json().catch(() => ({}))) as { payload?: any[] };
  const payload = (body.payload || []).map((item, index) => ({
    ...item,
    id: item.id || `page-${randomUUID()}`,
    pageKey: item.pageKey || item.slug || `page-${index + 1}`,
    slug: String(item.slug || "").replace(/^\/+/, ""),
    updatedAt: new Date().toISOString(),
    createdAt: item.createdAt || new Date().toISOString()
  }));
  await writePages(payload);
  await syncNavigationFromPages();
  await revalidateSiteContent();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { pageId?: string };
  if (!body.pageId) return NextResponse.json({ message: "pageId required" }, { status: 400 });

  try {
    await deletePageById(body.pageId);
    await syncNavigationFromPages();
    await revalidateSiteContent();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Delete failed" }, { status: 400 });
  }
}
