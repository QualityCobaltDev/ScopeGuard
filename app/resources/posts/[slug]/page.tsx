import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { readPosts } from "@/lib/cms-store";
import { readCollection } from "@/lib/content-store";

export default async function ResourcePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [posts, resources] = await Promise.all([readPosts(), readCollection("resources")]);
  const post = posts.find((item) => (item.slug === slug || item.id === slug) && item.isPublished);
  if (!post) notFound();

  const linkedResources = resources.filter((resource) => (resource as any).linkedPostId === post.id && resource.status === "published");

  return (
    <div className="container py-20">
      <SectionTitle eyebrow="Resource Post" title={post.title} description={post.excerpt} />
      <Card className="p-8">
        <p className="text-sm leading-7 text-muted">{post.body}</p>
      </Card>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {linkedResources.map((resource) => (
          <Card key={resource.id} className="p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-brand-soft">{resource.label}</p>
            <h3 className="mt-2 text-lg font-semibold">{resource.title}</h3>
            <p className="mt-2 text-sm text-muted">{resource.summary}</p>
            <a className="mt-3 inline-block text-sm underline" href={`/api/resources/download/${resource.id}`}>{resource.ctaLabel || "Download"}</a>
          </Card>
        ))}
      </div>
    </div>
  );
}
