import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/permissions";
import { ContentPost, readPosts, writePosts } from "@/lib/cms-store";
import { revalidateSiteContent } from "@/lib/site-sync";
import { sanitizePostInput } from "@/lib/blog";

async function adminGuard() {
  try {
    await requireAdmin();
    return null;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

function hasDuplicateSlugs(posts: ContentPost[]): string | null {
  const seen = new Set<string>();
  for (const post of posts) {
    if (seen.has(post.slug)) return post.slug;
    seen.add(post.slug);
  }
  return null;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;

  const body = (await request.json().catch(() => ({}))) as { payload?: Partial<ContentPost> };
  if (!body.payload) return NextResponse.json({ message: "payload is required" }, { status: 400 });

  const posts = await readPosts();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return NextResponse.json({ message: "Post not found" }, { status: 404 });

  const next = [...posts];
  const incoming = sanitizePostInput(body.payload);
  const prior = posts[index];
  next[index] = {
    ...prior,
    ...incoming,
    id,
    updatedAt: new Date().toISOString(),
    publishedAt: incoming.status === "published" ? prior.publishedAt || new Date().toISOString() : undefined
  };

  const duplicate = hasDuplicateSlugs(next);
  if (duplicate) return NextResponse.json({ message: `Duplicate slug detected: ${duplicate}` }, { status: 400 });

  await writePosts(next);
  await revalidateSiteContent();
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;

  const posts = await readPosts();
  const next = posts.filter((post) => post.id !== id);
  if (next.length === posts.length) return NextResponse.json({ message: "Post not found" }, { status: 404 });

  await writePosts(next);
  await revalidateSiteContent();
  return NextResponse.json({ ok: true });
}
