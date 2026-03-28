import { ArrowUpRight, BookOpenText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";

export const metadata = createMetadata({
  title: "Resources",
  description: "Resource hub for freelancer legal and business growth content.",
  path: "/resources"
});

export default async function ResourcesPage() {
  const resources = await readCollection("resources");

  const published = resources
    .filter((item) => item.status === "published")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="container py-20">
      <SectionTitle eyebrow="Resources" title="Build your premium growth library" description="All entries are editable from admin and can be expanded as your content ecosystem grows." />
      <div className="grid gap-5 md:grid-cols-3">
        {published.map((item) => {
          const href = `/api/resources/download/${item.id}`;

          return (
            <Card key={item.id} className="p-6">
              <BookOpenText className="h-5 w-5 text-brand-soft" />
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-brand-soft">{item.label}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p>
              <p className="mt-2 text-xs text-muted">Access: {item.accessType || "public"}</p>
              {(item as any).linkedPostId ? <a className="mt-1 inline-block text-xs underline" href={`/resources/posts/${(item as any).linkedPostId}`}>View linked post</a> : null}
              <a href={href} className="mt-5 inline-flex items-center gap-1 text-sm text-foreground">
                {item.ctaLabel || "Open resource"} <ArrowUpRight className="h-4 w-4" />
              </a>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
