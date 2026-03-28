import { notFound } from "next/navigation";
import { BlogBlockRenderer } from "@/components/marketing/blog-block-renderer";
import { Card } from "@/components/ui/card";
import { readFiles } from "@/lib/file-store";
import { readPosts } from "@/lib/cms-store";
import { BlogPostBlock, resolveDownloadUrl } from "@/lib/post-blocks";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [posts, files] = await Promise.all([readPosts(), readFiles()]);
  const post = posts.find((item) => item.slug === slug && item.isPublished);
  if (!post) notFound();

  const blocks: BlogPostBlock[] = post.blocks?.length
    ? post.blocks.map((block) => (block.type === "download" ? { ...block, url: resolveDownloadUrl(block.url, block.fileId, files) } : block))
    : [{ id: `${post.id}-fallback`, type: "richText", text: post.body }];

  return (
    <article className="container py-12 sm:py-16 md:py-20">
      <header className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">Blog article</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-base leading-7 text-muted">{post.excerpt}</p>
        <p className="mt-5 text-sm text-muted">Published {new Date(post.publishDate || post.updatedAt).toLocaleDateString()}</p>
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
    </article>
  );
}
