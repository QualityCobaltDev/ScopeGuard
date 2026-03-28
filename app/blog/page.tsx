import Link from "next/link";
import { Card } from "@/components/ui/card";
import { readPosts } from "@/lib/cms-store";

export default async function BlogIndexPage() {
  const posts = (await readPosts())
    .filter((post) => post.isPublished)
    .sort((a, b) => new Date(b.publishDate || b.updatedAt).getTime() - new Date(a.publishDate || a.updatedAt).getTime());

  return (
    <div className="container py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">Blog</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Insights to protect your scope, clients, and growth.</h1>
        <p className="mt-4 text-base leading-7 text-muted">Read practical breakdowns from the ScopeGuard team covering boundaries, systems, delivery, and client operations.</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex h-full flex-col overflow-hidden border-border/80">
            {post.featuredImageUrl ? (
              <img src={post.featuredImageUrl} alt={post.title} className="h-52 w-full border-b border-border/70 object-cover" loading="lazy" />
            ) : (
              <div className="h-52 border-b border-border/70 bg-gradient-to-br from-brand/20 via-white/[0.02] to-transparent" />
            )}
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{new Date(post.publishDate || post.updatedAt).toLocaleDateString()}</p>
              <h2 className="mt-3 text-xl font-semibold text-foreground">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-7 text-muted">{post.excerpt || post.body}</p>
              <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex min-h-10 items-center text-sm font-medium text-brand-soft hover:text-foreground">
                Read article →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
