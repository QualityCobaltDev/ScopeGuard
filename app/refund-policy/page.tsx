import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";

export const metadata = createMetadata({ title: "Refund Policy", description: "ScopeGuard digital resource refund policy.", path: "/refund-policy" });

export default async function RefundPolicyPage() {
  const site = await readCollection("site");
  return <div className="container py-20"><article className="prose-legal mx-auto max-w-3xl"><h1 className="text-3xl font-semibold text-foreground">Refund Policy</h1><p>Last updated: March 25, 2026.</p>{site.legal.refund.map((p, idx) => <p key={idx}>{localizeText(p, undefined, String(p))}</p>)}</article></div>;
}
