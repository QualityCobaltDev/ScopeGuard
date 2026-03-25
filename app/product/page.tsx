import { CheckCircle2, Layers, ShieldAlert, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { LinkButton } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";

export const metadata = createMetadata({
  title: "Product",
  description: "Explore Elevare AI deliverables, pricing tiers, and premium growth features.",
  path: "/product"
});

export default async function ProductPage() {
  const [products, pricing] = await Promise.all([readCollection("products"), readCollection("pricing")]);
  return (
    <div className="container py-20">
      <SectionTitle eyebrow="Product Overview" title="Everything needed to launch and scale with premium clarity" description="Designed for digital founders who want conversion and operational confidence." />
      <div className="grid gap-6 md:grid-cols-3">{[[ShieldAlert, "Risk control", "Reduce launch confusion and offer ambiguity."], [Layers, "System depth", "From positioning to post-purchase flow."], [Target, "Conversion focus", "Improve buyer confidence and action rates."]].map(([Icon, title, description]) => <Card key={title as string} className="p-6"><Icon className="h-5 w-5 text-brand-soft" /><h3 className="mt-3 text-lg font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-7 text-muted">{description as string}</p></Card>)}</div>
      <section className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_1fr]"><Card className="p-8"><h3 className="text-xl font-semibold">What&apos;s included</h3><ul className="mt-5 space-y-3">{products.deliverables.map((item) => <li key={item} className="flex items-start gap-2 text-sm text-muted"><CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />{item}</li>)}</ul></Card><Card className="p-8"><h3 className="text-xl font-semibold">Who this is for</h3><p className="mt-4 text-sm leading-7 text-muted">{products.fit}</p><h4 className="mt-6 font-medium text-foreground">Bonus items</h4><ul className="mt-3 space-y-2 text-sm text-muted">{products.bonuses.map((bonus) => <li key={bonus}>• {bonus}</li>)}</ul></Card></section>
      <section className="mt-16"><h3 className="text-center text-2xl font-semibold">Tier comparison</h3><div className="mt-6 overflow-x-auto rounded-2xl border border-border"><table className="min-w-full text-left text-sm"><thead className="bg-white/5 text-foreground"><tr><th className="p-4">Tier</th><th className="p-4">Outcome</th><th className="p-4">Price</th><th className="p-4">Action</th></tr></thead><tbody>{pricing.map((tier) => <tr key={tier.id} className="border-t border-border/70"><td className="p-4 font-medium text-foreground">{tier.name}</td><td className="p-4 text-muted">{tier.description}</td><td className="p-4 text-foreground">{tier.price}</td><td className="p-4"><LinkButton href="/contact" size="sm" variant="secondary">{tier.cta}</LinkButton></td></tr>)}</tbody></table></div></section>
    </div>
  );
}
