import { ArrowUpRight, BookOpenText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { readFiles } from "@/lib/file-store";

export const metadata = createMetadata({
  title: "Resources",
  description: "Resource hub for freelancer legal and business growth content.",
  path: "/resources"
});

export default async function ResourcesPage() {
  const [resources, files] = await Promise.all([readCollection("resources"), readFiles()]);
  const fileMap = new Map(files.map((item) => [item.id, item]));

  const published = resources
    .filter((item) => item.status === "published")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="container py-20">
      <SectionTitle eyebrow="Resources" title="Build your premium growth library" description="All entries are editable from admin and can be expanded as your content ecosystem grows." />
      <div className="grid gap-5 md:grid-cols-3">
        {published.map((item) => {
          const linkedFile = item.fileId ? fileMap.get(item.fileId) : undefined;
          const href = item.externalUrl || linkedFile?.publicUrl || "/contact";

          return (
            <Card key={item.id} className="p-6">
              <BookOpenText className="h-5 w-5 text-brand-soft" />
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-brand-soft">{item.label}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p>
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
