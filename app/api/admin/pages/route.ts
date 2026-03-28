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

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { action?: "create" | "duplicate"; payload?: any; pageId?: string };
  const pages = await readPages();

  if (body.action === "duplicate") {
    const source = pages.find((item) => item.id === body.pageId);
    if (!source) return NextResponse.json({ message: "Page not found" }, { status: 404 });
    const copy = {
      ...source,
      id: `page-${randomUUID()}`,
      title: `${source.title} (Copy)`,
      slug: `${source.slug}-copy-${Date.now().toString().slice(-4)}`,
      pageKey: `${source.pageKey}-copy-${Date.now().toString().slice(-4)}`,
      isSystemPage: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await writePages([...pages, copy]);
    await syncNavigationFromPages();
    await revalidateSiteContent();
    return NextResponse.json(copy);
  }

  const payload = body.payload || {};
  const created = {
    id: `page-${randomUUID()}`,
    title: String(payload.title || ""),
    internalName: String(payload.internalName || ""),
    slug: String(payload.slug || "").replace(/^\/+/, ""),
    pageKey: String(payload.pageKey || payload.slug || `page-${pages.length + 1}`),
    pageType: payload.pageType || "standard",
    seoTitle: String(payload.seoTitle || ""),
    seoDescription: String(payload.seoDescription || ""),
    ogTitle: payload.ogTitle ? String(payload.ogTitle) : undefined,
    ogDescription: payload.ogDescription ? String(payload.ogDescription) : undefined,
    isPublished: Boolean(payload.isPublished ?? false),
    isVisible: Boolean(payload.isVisible ?? true),
    showInNavigation: Boolean(payload.showInNavigation ?? false),
    isSystemPage: Boolean(payload.isSystemPage ?? false),
    sortOrder: Number(payload.sortOrder || pages.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await writePages([...pages, created]);
  await syncNavigationFromPages();
  await revalidateSiteContent();
  return NextResponse.json(created);
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
