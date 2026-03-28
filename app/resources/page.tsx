import { SectionTitle } from "@/components/marketing/section-title";
import { ResourcesLibrary } from "@/components/marketing/resources-library";
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
    <div className="container py-12 sm:py-16 md:py-20">
      <SectionTitle eyebrow="Resources" title="Build your premium growth library" description="Search, filter, and unlock structured downloads built for freelancers." />
      <ResourcesLibrary resources={published} />
    </div>
  );
}
