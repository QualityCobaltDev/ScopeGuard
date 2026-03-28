import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { getServerLocale } from "@/lib/i18n-server";
import { localizeText } from "@/lib/localized";

export const metadata = createMetadata({ title: "Privacy Policy", description: "ScopeGuard privacy policy.", path: "/privacy" });

export default async function PrivacyPage() {
  const locale = await getServerLocale();
  const site = await readCollection("site");
  return <div className="container py-20"><article className="prose-legal mx-auto max-w-3xl"><h1 className="text-3xl font-semibold text-foreground">Privacy Policy</h1><p>Last updated: March 25, 2026.</p>{site.legal.privacy.map((p, idx) => <p key={idx}>{localizeText(p as any, locale, String(p))}</p>)}</article></div>;
}
