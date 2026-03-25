import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";

export const metadata = createMetadata({ title: "Terms", description: "Elevare AI terms and conditions.", path: "/terms" });

export default async function TermsPage() {
  const site = await readCollection("site");
  return <div className="container py-20"><article className="prose-legal mx-auto max-w-3xl"><h1 className="text-3xl font-semibold text-foreground">Terms of Service</h1><p>Last updated: March 25, 2026.</p>{site.legal.terms.map((p, idx) => <p key={idx}>{p}</p>)}</article></div>;
}
