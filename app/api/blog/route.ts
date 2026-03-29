import { NextResponse } from "next/server";
import { isPublishedPost, resolvePostDate } from "@/lib/blog";
import { readPosts } from "@/lib/cms-store";

export async function GET() {
  const posts = (await readPosts())
    .filter(isPublishedPost)
    .sort((a, b) => new Date(resolvePostDate(b)).getTime() - new Date(resolvePostDate(a)).getTime());

  return NextResponse.json(posts);
}
