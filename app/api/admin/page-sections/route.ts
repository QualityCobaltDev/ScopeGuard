import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { readPageSections, readPages, writePageSections } from "@/lib/cms-store";
import { revalidateSiteContent } from "@/lib/site-sync";

export async function GET() {
  try {
    await requireAdmin();
    const [sections, pages] = await Promise.all([readPageSections(), readPages()]);
    return NextResponse.json({ sections, pages });
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
  const payload = (body.payload || []).map((item) => ({
    ...item,
    id: item.id || `section-${randomUUID()}`,
    pageId: item.pageId,
    pageKey: item.pageKey || "",
    updatedAt: new Date().toISOString()
  }));

  await writePageSections(payload);
  await revalidateSiteContent();
  return NextResponse.json({ ok: true });
}
