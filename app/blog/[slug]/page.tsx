import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogBlockRenderer } from "@/components/marketing/blog-block-renderer";
import { Card } from "@/components/ui/card";
import { estimateReadingMinutes, isPublishedPost, resolvePostDate } from "@/lib/blog";
import { readFiles } from "@/lib/file-store";
import { readPosts } from "@/lib/cms-store";
import { BlogPostBlock, resolveDownloadUrl } from "@/lib/post-blocks";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = await readPosts();
  const post = posts.find((item) => item.slug === slug && isPublishedPost(item));
  if (!post) return createMetadata({ title: "Blog", description: "Article not found.", path: "/blog" });

  return createMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.body.slice(0, 150),
    path: `/blog/${post.slug}`
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [posts, files] = await Promise.all([readPosts(), readFiles()]);
  const post = posts.find((item) => item.slug === slug && isPublishedPost(item));
  if (!post) notFound();

  const blocks: BlogPostBlock[] = post.blocks?.length
    ? post.blocks.map((block) => (block.type === "download" ? { ...block, url: resolveDownloadUrl(block.url, block.fileId, files) } : block))
    : [{ id: `${post.id}-fallback`, type: "richText", text: post.body }];

  const relatedPosts = posts
    .filter((item) => item.id !== post.id && isPublishedPost(item))
    .sort((a, b) => new Date(resolvePostDate(b)).getTime() - new Date(resolvePostDate(a)).getTime())
    .slice(0, 3);

  return (
    <article className="container py-12 sm:py-16 md:py-20">
      <header className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">Blog article</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-base leading-7 text-muted">{post.excerpt}</p>
        <p className="mt-5 text-sm text-muted">By {post.author} · {new Date(resolvePostDate(post)).toLocaleDateString()} · {estimateReadingMinutes(post)} min read</p>
      </header>

      {post.featuredImageUrl ? (
        <div className="mx-auto mt-8 max-w-4xl">
          <img src={post.featuredImageUrl} alt={post.title} className="w-full rounded-2xl border border-border/70 object-cover" />
        </div>
      ) : null}

      <Card className="mx-auto mt-8 max-w-3xl p-5 sm:p-8">
        <div className="space-y-6">
          {blocks.map((block) => (
            <BlogBlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </Card>

      {relatedPosts.length ? (
        <section className="mx-auto mt-12 max-w-5xl">
          <h2 className="text-2xl font-semibold">Related posts</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((item) => (
              <Card key={item.id} className="flex h-full flex-col p-4">
                <p className="text-xs text-muted">{new Date(resolvePostDate(item)).toLocaleDateString()}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{item.excerpt || item.body}</p>
                <Link href={`/blog/${item.slug}`} className="mt-3 text-sm font-medium text-brand-soft hover:text-foreground">Read more →</Link>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
