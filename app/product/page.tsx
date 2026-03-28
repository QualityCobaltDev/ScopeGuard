import { CheckCircle2, Layers, ShieldAlert, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { LinkButton } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";
import { t } from "@/lib/i18n";

export const metadata = createMetadata({
  title: "Product",
  description: "Explore Elevare AI deliverables, pricing tiers, and premium growth features.",
  path: "/product"
});

export default async function ProductPage() {
  const dict = t();
  const [products, pricing] = await Promise.all([readCollection("products"), readCollection("pricing")]);
  return (
    <div className="container py-12 sm:py-16 md:py-20">
      <SectionTitle
        eyebrow={dict.productOverviewEyebrow}
        title={dict.productOverviewTitle}
        description={dict.productOverviewDescription}
      />
      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {[
          [ShieldAlert, "Risk Control", "Mitigate unpaid invoices, ambiguous scope, and legal misunderstandings."],
          [Layers, "System Depth", "From legal clauses to pricing mechanics and communication scripts."],
          [Target, "Revenue Focus", "Increase close rates and deal value with clearer positioning and negotiation assets."]
        ].map(([Icon, title, description]) => (
          <Card key={title as string} className="p-5 sm:p-6">
            <Icon className="h-5 w-5 text-brand-soft" />
            <h3 className="mt-3 text-lg font-semibold">{title as string}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{description as string}</p>
          </Card>
        ))}
      </div>

      <section className="mt-10 grid gap-4 sm:gap-6 lg:mt-16 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-5 sm:p-8">
          <h3 className="text-xl font-semibold">What&apos;s included</h3>
          <ul className="mt-5 space-y-3">
            {products.deliverables.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-7 text-muted">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" />{localizeText(item, undefined, String(item))}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5 sm:p-8">
          <h3 className="text-xl font-semibold">Who this is for</h3>
          <p className="mt-4 text-sm leading-7 text-muted">{localizeText(products.fit, undefined, String(products.fit))}</p>
          <h4 className="mt-6 font-medium text-foreground">Bonus items</h4>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">{products.bonuses.map((bonus) => <li key={typeof bonus === "string" ? bonus : JSON.stringify(bonus)}>• {localizeText(bonus, undefined, String(bonus))}</li>)}</ul>
        </Card>
      </section>

      <section className="mt-10 sm:mt-12 md:mt-16">
        <h3 className="text-center text-2xl font-semibold">Tier comparison</h3>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
          <table className="min-w-[640px] text-left text-sm">
            <thead className="bg-white/5 text-foreground"><tr><th className="p-4">Tier</th><th className="p-4">Primary outcome</th><th className="p-4">Price</th><th className="p-4">Action</th></tr></thead>
            <tbody>
              {pricing.map((tier) => (
                <tr key={tier.id} className="border-t border-border/70">
                  <td className="p-4 font-medium text-foreground">{localizeText(tier.name, undefined, String(tier.name))}</td>
                  <td className="p-4 text-muted">{localizeText((tier.benefit || tier.description), undefined, String(tier.benefit || tier.description || ""))}</td>
                  <td className="p-4 text-foreground">{localizeText(tier.price, undefined, String(tier.price))}</td>
                  <td className="p-4"><LinkButton href="/contact" size="sm" variant="secondary">{localizeText(tier.cta, undefined, String(tier.cta))}</LinkButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
