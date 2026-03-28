import { notFound } from "next/navigation";
import { ManagedPageSections } from "@/components/marketing/managed-page-sections";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";
import { isPageLive, readManagedPageContent } from "@/lib/managed-page-rendering";

const defaultRefundMetadata = { title: "Refund Policy", description: "ScopeGuard digital resource refund policy.", path: "/refund-policy" };

export async function generateMetadata() {
  const { page } = await readManagedPageContent("refund-policy");
  return createMetadata({
    ...defaultRefundMetadata,
    title: page?.seoTitle || defaultRefundMetadata.title,
    description: page?.seoDescription || defaultRefundMetadata.description
  });
}

export default async function RefundPolicyPage() {
  const [{ page, sections }, site] = await Promise.all([readManagedPageContent("refund-policy"), readCollection("site")]);
  if (!isPageLive(page)) notFound();

  return (
    <>
      <div className="container py-20"><article className="prose-legal mx-auto max-w-3xl"><h1 className="text-3xl font-semibold text-foreground">Refund Policy</h1><p>Last updated: March 25, 2026.</p>{site.legal.refund.map((p, idx) => <p key={idx}>{localizeText(p, undefined, String(p))}</p>)}</article></div>
      <ManagedPageSections sections={sections} />
    </>
  );
}
