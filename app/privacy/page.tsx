import { notFound } from "next/navigation";
import { ManagedPageSections } from "@/components/marketing/managed-page-sections";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";
import { isPageLive, readManagedPageContent } from "@/lib/managed-page-rendering";

const defaultPrivacyMetadata = { title: "Privacy Policy", description: "ScopeGuard privacy policy.", path: "/privacy" };

export async function generateMetadata() {
  const { page } = await readManagedPageContent("privacy");
  return createMetadata({
    ...defaultPrivacyMetadata,
    title: page?.seoTitle || defaultPrivacyMetadata.title,
    description: page?.seoDescription || defaultPrivacyMetadata.description
  });
}

export default async function PrivacyPage() {
  const [{ page, sections }, site] = await Promise.all([readManagedPageContent("privacy"), readCollection("site")]);
  if (!isPageLive(page)) notFound();

  return (
    <>
      <div className="container py-20"><article className="prose-legal mx-auto max-w-3xl"><h1 className="text-3xl font-semibold text-foreground">Privacy Policy</h1><p>Last updated: March 25, 2026.</p>{site.legal.privacy.map((p, idx) => <p key={idx}>{localizeText(p, undefined, String(p))}</p>)}</article></div>
      <ManagedPageSections sections={sections} />
    </>
  );
}
