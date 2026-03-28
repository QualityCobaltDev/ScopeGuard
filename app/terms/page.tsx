import { notFound } from "next/navigation";
import { ManagedPageSections } from "@/components/marketing/managed-page-sections";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";
import { isPageLive, readManagedPageContent } from "@/lib/managed-page-rendering";

const defaultTermsMetadata = { title: "Terms", description: "ScopeGuard terms and conditions.", path: "/terms" };

export async function generateMetadata() {
  const { page } = await readManagedPageContent("terms");
  return createMetadata({
    ...defaultTermsMetadata,
    title: page?.seoTitle || defaultTermsMetadata.title,
    description: page?.seoDescription || defaultTermsMetadata.description
  });
}

export default async function TermsPage() {
  const [{ page, sections }, site] = await Promise.all([readManagedPageContent("terms"), readCollection("site")]);
  if (!isPageLive(page)) notFound();

  return (
    <>
      <div className="container py-20"><article className="prose-legal mx-auto max-w-3xl"><h1 className="text-3xl font-semibold text-foreground">Terms of Service</h1><p>Last updated: March 25, 2026.</p>{site.legal.terms.map((p, idx) => <p key={idx}>{localizeText(p, undefined, String(p))}</p>)}</article></div>
      <ManagedPageSections sections={sections} />
    </>
  );
}
