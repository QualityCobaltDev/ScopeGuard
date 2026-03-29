import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { BLOG_PAGE_SIZE, isPublishedPost, resolvePostDate } from "@/lib/blog";
import { Card } from "@/components/ui/card";
import { readPosts } from "@/lib/cms-store";

export const metadata = createMetadata({
  title: "Blog",
  description: "Guides and playbooks from ScopeGuard on project delivery, client protection, and sustainable growth.",
  path: "/blog"
});

export default async function BlogIndexPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams;
  const q = String(params.q || "").trim().toLowerCase();
  const page = Math.max(1, Number.parseInt(String(params.page || "1"), 10) || 1);

  const allPosts = (await readPosts())
    .filter(isPublishedPost)
    .sort((a, b) => new Date(resolvePostDate(b)).getTime() - new Date(resolvePostDate(a)).getTime());

  const filtered = q
    ? allPosts.filter((post) => [post.title, post.excerpt, post.body].join(" ").toLowerCase().includes(q))
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * BLOG_PAGE_SIZE;
  const posts = filtered.slice(start, start + BLOG_PAGE_SIZE);

  const queryString = (nextPage: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (nextPage > 1) query.set("page", String(nextPage));
    const built = query.toString();
    return built ? `?${built}` : "";
  };

  return (
    <div className="container py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-soft">Blog</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Insights to protect your scope, clients, and growth.</h1>
        <p className="mt-4 text-base leading-7 text-muted">Read practical breakdowns from the ScopeGuard team covering boundaries, systems, delivery, and client operations.</p>
      </div>

      <form className="mt-8">
        <label className="sr-only" htmlFor="blog-search">Search blog posts</label>
        <input
          id="blog-search"
          name="q"
          defaultValue={q}
          placeholder="Search articles"
          className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-brand-soft"
        />
      </form>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="group flex h-full flex-col overflow-hidden border-border/80 transition hover:-translate-y-0.5 hover:border-brand-soft/60">
            {post.featuredImageUrl ? (
              <img src={post.featuredImageUrl} alt={post.title} className="h-52 w-full border-b border-border/70 object-cover" loading="lazy" />
            ) : (
              <div className="h-52 border-b border-border/70 bg-gradient-to-br from-brand/20 via-white/[0.02] to-transparent" />
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted">
                <span>{new Date(resolvePostDate(post)).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.author}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-foreground">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-7 text-muted">{post.excerpt || post.body}</p>
              <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex min-h-10 items-center text-sm font-medium text-brand-soft transition group-hover:text-foreground">
                Read More →
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {!posts.length ? <p className="mt-8 text-sm text-muted">No posts found for your search.</p> : null}

      <div className="mt-10 flex items-center justify-between gap-3">
        <Link
          href={`/blog${queryString(safePage - 1)}`}
          aria-disabled={safePage <= 1}
          className={`rounded-lg border px-4 py-2 text-sm ${safePage <= 1 ? "pointer-events-none border-border/40 text-muted" : "border-border hover:border-brand-soft"}`}
        >
          Previous
        </Link>
        <p className="text-sm text-muted">Page {safePage} of {totalPages}</p>
        <Link
          href={`/blog${queryString(safePage + 1)}`}
          aria-disabled={safePage >= totalPages}
          className={`rounded-lg border px-4 py-2 text-sm ${safePage >= totalPages ? "pointer-events-none border-border/40 text-muted" : "border-border hover:border-brand-soft"}`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
