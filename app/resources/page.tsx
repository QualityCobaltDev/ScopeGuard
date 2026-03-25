import { ArrowUpRight, BookOpenText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";

export const metadata = createMetadata({
  title: "Resources",
  description: "Resource hub for premium offer positioning, conversion strategy, and digital product execution.",
  path: "/resources"
});

export default async function ResourcesPage() {
  const resources = await readCollection("resources");
  return (
    <div className="container py-20">
      <SectionTitle eyebrow="Resources" title="Build your premium growth library" description="All entries are editable from admin and can be expanded as your content ecosystem grows." />
      <div className="grid gap-5 md:grid-cols-3">{resources.map((item) => <Card key={item.id} className="p-6"><BookOpenText className="h-5 w-5 text-brand-soft" /><p className="mt-4 text-xs uppercase tracking-[0.14em] text-brand-soft">{item.type}</p><h3 className="mt-2 text-lg font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{item.description}</p><a href={item.link} className="mt-5 inline-flex items-center gap-1 text-sm text-foreground">{item.status} <ArrowUpRight className="h-4 w-4" /></a></Card>)}</div>
    </div>
  );
}
