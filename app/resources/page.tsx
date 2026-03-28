import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/marketing/section-title";
import { ResourcesLibrary } from "@/components/marketing/resources-library";
import { ManagedPageSections } from "@/components/marketing/managed-page-sections";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { isPageLive, readManagedPageContent } from "@/lib/managed-page-rendering";

const defaultResourcesMetadata = {
  title: "Resources",
  description: "Resource hub for freelancer legal and business growth content.",
  path: "/resources"
};

export async function generateMetadata() {
  const { page } = await readManagedPageContent("resources");
  return createMetadata({
    ...defaultResourcesMetadata,
    title: page?.seoTitle || defaultResourcesMetadata.title,
    description: page?.seoDescription || defaultResourcesMetadata.description
  });
}

export default async function ResourcesPage() {
  const [{ page, sections }, resources] = await Promise.all([readManagedPageContent("resources"), readCollection("resources")]);
  if (!isPageLive(page)) notFound();

  const published = resources
    .filter((item) => item.status === "published")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <>
      <div className="container py-12 sm:py-16 md:py-20">
        <SectionTitle eyebrow="Resources" title="Build your premium growth library" description="Search, filter, and unlock structured downloads built for freelancers." />
        <ResourcesLibrary resources={published} />
      </div>
      <ManagedPageSections sections={sections} />
    </>
  );
}
