import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";

export const metadata = createMetadata({
  title: "About",
  description: "Why Elevare AI exists and how it helps digital product operators scale premium offers.",
  path: "/about"
});

export default async function AboutPage() {
  const site = await readCollection("site");
  return (
    <div className="container py-20">
      <SectionTitle eyebrow={site.about.eyebrow} title={site.about.title} description={site.about.description} />
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">{site.about.sections.map((section) => <Card key={section.id} className="p-7"><h2 className="text-xl font-semibold">{section.title}</h2><p className="mt-3 text-sm leading-7 text-muted">{section.body}</p></Card>)}</div>
    </div>
  );
}
