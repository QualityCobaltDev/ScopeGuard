import { notFound } from "next/navigation";
import { CheckCircle2, Layers, ShieldAlert, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/marketing/section-title";
import { LinkButton } from "@/components/ui/button";
import { ManagedPageSections } from "@/components/marketing/managed-page-sections";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { localizeText } from "@/lib/localized";
import { t } from "@/lib/i18n";
import { isPageLive, readManagedPageContent } from "@/lib/managed-page-rendering";
import { Reveal } from "@/components/ui/reveal";

const defaultProductMetadata = {
  title: "Product",
  description: "Explore Elevare AI deliverables, pricing tiers, and premium growth features.",
  path: "/product"
};

export async function generateMetadata() {
  const { page } = await readManagedPageContent("product");
  return createMetadata({
    ...defaultProductMetadata,
    title: page?.seoTitle || defaultProductMetadata.title,
    description: page?.seoDescription || defaultProductMetadata.description
  });
}

export default async function ProductPage() {
  const dict = t();
  const [{ page, sections }, products, pricing] = await Promise.all([readManagedPageContent("product"), readCollection("products"), readCollection("pricing")]);
  if (!isPageLive(page)) notFound();

  return (
    <>
      <div className="container py-14 sm:py-18 md:py-24">
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
          ].map(([Icon, title, description], idx) => (
            <Reveal key={title as string} delay={idx * 0.06}>
              <Card className="h-full p-6">
                <Icon className="h-5 w-5 text-brand-soft" />
                <h3 className="mt-3 text-lg font-semibold">{title as string}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{description as string}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <section className="mt-10 grid gap-4 sm:gap-6 lg:mt-16 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Card className="p-6 sm:p-8">
              <h3 className="text-2xl font-semibold">What&apos;s included</h3>
              <ul className="mt-5 space-y-3">
                {products.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-7 text-muted">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" />{localizeText(item, undefined, String(item))}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="p-6 sm:p-8">
              <h3 className="text-2xl font-semibold">Who this is for</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{localizeText(products.fit, undefined, String(products.fit))}</p>
              <h4 className="mt-6 font-medium text-foreground">Bonus items</h4>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">{products.bonuses.map((bonus) => <li key={typeof bonus === "string" ? bonus : JSON.stringify(bonus)}>• {localizeText(bonus, undefined, String(bonus))}</li>)}</ul>
            </Card>
          </Reveal>
        </section>

        <section className="mt-10 sm:mt-12 md:mt-16">
          <h3 className="text-center text-3xl font-semibold">Tier comparison</h3>
          <Reveal className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card/80 shadow-[0_14px_34px_rgba(13,34,72,0.08)]">
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
          </Reveal>
        </section>
      </div>
      <ManagedPageSections sections={sections} />
    </>
  );
}
