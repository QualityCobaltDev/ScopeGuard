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

        <section className="mt-12 sm:mt-14 md:mt-20">
          <h3 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">Tier comparison</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-7 text-muted sm:text-[0.95rem]">
            Compare outcomes and choose the tier that matches your current stage.
          </p>

          <Reveal className="mx-auto mt-6 hidden w-full max-w-5xl overflow-hidden rounded-3xl border border-border/75 bg-card/90 shadow-[0_22px_60px_rgba(8,16,37,0.42)] backdrop-blur sm:block">
            <table className="w-full table-fixed text-left">
              <colgroup>
                <col className="w-[20%]" />
                <col className="w-[45%]" />
                <col className="w-[13%]" />
                <col className="w-[22%]" />
              </colgroup>
              <thead className="bg-white/[0.04] text-foreground">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/85 md:px-7">Tier</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/85 md:px-7">Primary outcome</th>
                  <th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-foreground/85">Price</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-foreground/85 md:px-7">Action</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((tier) => (
                  <tr key={tier.id} className="border-t border-border/70 align-middle">
                    <td className="px-6 py-5 align-middle text-[0.95rem] font-semibold leading-6 text-foreground md:px-7">
                      {localizeText(tier.name, undefined, String(tier.name))}
                    </td>
                    <td className="px-6 py-5 align-middle text-sm leading-6 text-muted md:px-7">
                      {localizeText((tier.benefit || tier.description), undefined, String(tier.benefit || tier.description || ""))}
                    </td>
                    <td className="px-3 py-5 text-center align-middle text-[1.02rem] font-semibold leading-none text-foreground">
                      {localizeText(tier.price, undefined, String(tier.price))}
                    </td>
                    <td className="px-6 py-5 text-center align-middle md:px-7">
                      <LinkButton
                        href="/contact"
                        size="sm"
                        variant="secondary"
                        className="h-10 min-w-[12.75rem] rounded-xl px-5 text-sm font-semibold tracking-[0.01em] transition-all duration-200 hover:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-brand/50"
                      >
                        {localizeText(tier.cta, undefined, String(tier.cta))}
                      </LinkButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal className="mx-auto mt-6 grid w-full max-w-xl gap-3.5 sm:hidden">
            {pricing.map((tier) => (
              <Card key={tier.id} className="rounded-2xl border-border/75 bg-card/90 p-5 shadow-[0_16px_40px_rgba(8,16,37,0.34)]">
                <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-3.5">
                  <p className="text-base font-semibold leading-6 text-foreground">{localizeText(tier.name, undefined, String(tier.name))}</p>
                  <p className="shrink-0 text-base font-semibold leading-6 text-foreground">{localizeText(tier.price, undefined, String(tier.price))}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {localizeText((tier.benefit || tier.description), undefined, String(tier.benefit || tier.description || ""))}
                </p>
                <LinkButton
                  href="/contact"
                  size="sm"
                  variant="secondary"
                  className="mt-4 h-11 w-full rounded-xl px-5 text-sm font-semibold tracking-[0.01em] transition-all duration-200 hover:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  {localizeText(tier.cta, undefined, String(tier.cta))}
                </LinkButton>
              </Card>
            ))}
          </Reveal>
        </section>
      </div>
      <ManagedPageSections sections={sections} />
    </>
  );
}
