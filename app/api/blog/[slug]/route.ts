import { NextResponse } from "next/server";
import { isPublishedPost } from "@/lib/blog";
import { readPosts } from "@/lib/cms-store";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await readPosts();
  const post = posts.find((item) => item.slug === slug && isPublishedPost(item));

  if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}
