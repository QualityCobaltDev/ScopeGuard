import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { getServerLocale } from "@/lib/i18n-server";
import { localizeText } from "@/lib/localized";

export const metadata = createMetadata({ title: "Refund Policy", description: "ScopeGuard digital resource refund policy.", path: "/refund-policy" });

export default async function RefundPolicyPage() {
  const locale = await getServerLocale();
  const site = await readCollection("site");
  return <div className="container py-20"><article className="prose-legal mx-auto max-w-3xl"><h1 className="text-3xl font-semibold text-foreground">Refund Policy</h1><p>Last updated: March 25, 2026.</p>{site.legal.refund.map((p, idx) => <p key={idx}>{localizeText(p as any, locale, String(p))}</p>)}</article></div>;
}
