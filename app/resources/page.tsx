import { SectionTitle } from "@/components/marketing/section-title";
import { ResourcesLibrary } from "@/components/marketing/resources-library";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { getServerLocale } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const metadata = createMetadata({
  title: "Resources",
  description: "Resource hub for freelancer legal and business growth content.",
  path: "/resources"
});

export default async function ResourcesPage() {
  const locale = await getServerLocale();
  const dict = t(locale);
  const resources = await readCollection("resources");

  const published = resources
    .filter((item) => item.status === "published")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="container py-12 sm:py-16 md:py-20">
      <SectionTitle eyebrow={dict.resourcesEyebrow} title={dict.resourcesTitle} description={dict.resourcesDescription} />
      <ResourcesLibrary resources={published} locale={locale} />
    </div>
  );
}
