import { Check } from "lucide-react";
import { checkoutLinks } from "@/lib/checkout";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { SectionTitle } from "@/components/marketing/section-title";
import type { PricingTier } from "@/lib/content-types";
import type { Locale } from "@/lib/i18n";
import { formatCurrency, t } from "@/lib/i18n";
import { localizeText, parsePriceAmount } from "@/lib/localized";

const linkMap = { starter: checkoutLinks.starter, pro: checkoutLinks.pro, premium: checkoutLinks.premium } as const;

export function PricingSection({ tiers, locale }: { tiers: PricingTier[]; locale: Locale }) {
  const dict = t(locale);
  return (
    <section className="container py-12 sm:py-16 md:py-20" id="pricing">
      <SectionTitle
        eyebrow={dict.pricingOfferLadder}
        title={dict.pricingChoose}
        description="Start with core protection or deploy the full freelancer revenue system. Every tier builds on the previous level."
      />
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className={`p-5 sm:p-6 ${tier.featured ? "border-brand/70 bg-gradient-to-b from-brand/15 via-card/90 to-card/80 shadow-glow" : ""}`}>
            {tier.featured ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">{dict.pricingBestValue}</p> : null}
            <p className="text-sm font-medium text-brand-soft">{localizeText(tier.name, locale)}</p>
            <h3 className="mt-1 text-xl font-semibold text-foreground">{localizeText(tier.label, locale)}</h3>
            <p className="mt-3 text-3xl font-semibold text-foreground">{parsePriceAmount(localizeText(tier.price as any, locale)) ? formatCurrency(parsePriceAmount(localizeText(tier.price as any, locale))!, locale) : localizeText(tier.price as any, locale)}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{localizeText(tier.description, locale)}</p>
            {tier.audience ? <p className="mt-2 text-xs leading-6 text-muted">{localizeText(tier.audience, locale)}</p> : null}
            <ul className="mt-5 space-y-2.5">
              {tier.includes.map((line) => (
                <li key={typeof line === "string" ? line : JSON.stringify(line)} className="flex items-start gap-2 text-sm leading-6 text-muted"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" /><span>{localizeText(line, locale)}</span></li>
              ))}
            </ul>
            {tier.benefit ? <p className="mt-4 text-sm font-medium text-foreground">{localizeText(tier.benefit, locale)}</p> : null}
            <LinkButton href={tier.ctaUrl || linkMap[tier.id as keyof typeof linkMap] || "/product"} className="mt-6 h-11 w-full" variant={tier.featured ? "default" : "secondary"}>{localizeText(tier.cta, locale)}</LinkButton>
          </Card>
        ))}
      </div>
    </section>
  );
}
