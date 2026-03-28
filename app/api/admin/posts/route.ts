import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { ContentPost, readPosts, writePosts } from "@/lib/cms-store";
import { normalizePostBlocks, safePublicAssetUrl } from "@/lib/post-blocks";
import { revalidateSiteContent } from "@/lib/site-sync";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function normalizePostInput(item: Partial<ContentPost>): ContentPost {
  const now = new Date().toISOString();
  const title = String(item.title || "").trim();
  const slug = slugify(String(item.slug || title));
  return {
    id: item.id || randomUUID(),
    slug,
    title,
    excerpt: String(item.excerpt || "").trim(),
    body: String(item.body || "").trim(),
    blocks: normalizePostBlocks(item.blocks),
    featuredImageUrl: safePublicAssetUrl(String(item.featuredImageUrl || "")) || undefined,
    publishDate: item.publishDate || undefined,
    isPublished: Boolean(item.isPublished),
    updatedAt: now,
    createdAt: item.createdAt || now
  };
}

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
  const normalized = (body.payload || []).map((item) => normalizePostInput(item));

  const slugSet = new Set<string>();
  for (const post of normalized) {
    if (!post.title || !post.slug) return NextResponse.json({ message: "Each post requires a title and slug." }, { status: 400 });
    if (slugSet.has(post.slug)) return NextResponse.json({ message: `Duplicate slug detected: ${post.slug}` }, { status: 400 });
    slugSet.add(post.slug);
  }

  await writePosts(normalized);
  await revalidateSiteContent();
  return NextResponse.json({ ok: true });
}
