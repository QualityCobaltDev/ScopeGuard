import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { ManagedPageSections } from "@/components/marketing/managed-page-sections";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";
import { isPageLive, readManagedPageContent } from "@/lib/managed-page-rendering";

const defaultAboutMetadata = {
  title: "About",
  description: "Why Elevare AI exists and how it helps digital product operators scale premium offers.",
  path: "/about"
};

export async function generateMetadata() {
  const { page } = await readManagedPageContent("about");
  return createMetadata({
    ...defaultAboutMetadata,
    title: page?.seoTitle || defaultAboutMetadata.title,
    description: page?.seoDescription || defaultAboutMetadata.description
  });
}

export default async function AboutPage() {
  const [{ page, sections }, site] = await Promise.all([readManagedPageContent("about"), readCollection("site")]);
  if (!isPageLive(page)) notFound();

  return (
    <>
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
      <ManagedPageSections sections={sections} />
    </>
  );
}
