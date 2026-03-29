import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { ContentPost, readPosts, writePosts } from "@/lib/cms-store";
import { normalizePostBlocks, safePublicAssetUrl } from "@/lib/post-blocks";
import { revalidateSiteContent } from "@/lib/site-sync";
import { sanitizePostInput } from "@/lib/blog";

function normalizePostInput(item: Partial<ContentPost>): ContentPost {
  const now = new Date().toISOString();
  const base = sanitizePostInput(item);
  const publishDate = base.publishDate || (base.status === "published" ? now.slice(0, 10) : undefined);

  return {
    id: item.id || randomUUID(),
    slug: String(base.slug || ""),
    title: String(base.title || ""),
    author: String(base.author || "ScopeGuard Team"),
    excerpt: String(base.excerpt || ""),
    body: String(base.body || ""),
    blocks: normalizePostBlocks(base.blocks),
    featuredImageUrl: safePublicAssetUrl(String(base.featuredImageUrl || "")) || undefined,
    status: base.status === "published" ? "published" : "draft",
    publishDate,
    publishedAt: base.status === "published" ? (item.publishedAt || now) : undefined,
    seoTitle: base.seoTitle || undefined,
    seoDescription: base.seoDescription || undefined,
    updatedAt: now,
    createdAt: item.createdAt || now
  };
}

async function adminGuard() {
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

function validatePosts(posts: ContentPost[]) {
  const slugSet = new Set<string>();
  for (const post of posts) {
    if (!post.title || !post.slug) return `Each post requires a title and slug.`;
    if (slugSet.has(post.slug)) return `Duplicate slug detected: ${post.slug}`;
    slugSet.add(post.slug);
  }
  return null;
}

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  return NextResponse.json(await readPosts());
}

export async function POST(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as { payload?: Partial<ContentPost> };
  if (!body.payload) return NextResponse.json({ message: "payload is required" }, { status: 400 });

  const posts = await readPosts();
  const next = [...posts, normalizePostInput(body.payload)];
  const error = validatePosts(next);
  if (error) return NextResponse.json({ message: error }, { status: 400 });

  await writePosts(next);
  await revalidateSiteContent();
  return NextResponse.json({ ok: true, id: next[next.length - 1].id });
}

export async function PUT(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;

  const body = (await request.json().catch(() => ({}))) as { payload?: ContentPost[] };
  const normalized = (body.payload || []).map((item) => normalizePostInput(item));
  const error = validatePosts(normalized);
  if (error) return NextResponse.json({ message: error }, { status: 400 });

  await writePosts(normalized);
  await revalidateSiteContent();
  return NextResponse.json({ ok: true });
}
