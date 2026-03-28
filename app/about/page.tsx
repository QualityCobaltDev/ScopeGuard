import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";

export const metadata = createMetadata({
  title: "About",
  description: "Why Elevare AI exists and how it helps digital product operators scale premium offers.",
  path: "/about"
});

export default async function AboutPage() {
  const site = await readCollection("site");
  return (
    <div className="container py-12 sm:py-16 md:py-20">
      <SectionTitle eyebrow={localizeText(site.about.eyebrow)} title={localizeText(site.about.title)} description={localizeText(site.about.description)} />
      <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 md:grid-cols-2">
        {site.about.sections.map((section) => (
          <Card key={section.id} className="p-5 sm:p-7">
            <h2 className="text-xl font-semibold">{localizeText(section.title)}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{localizeText(section.body)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
