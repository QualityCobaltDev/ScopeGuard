import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import type { PricingTier } from "@/lib/content-types";
import { formatCurrency } from "@/lib/i18n";
import { localizeText, parsePriceAmount } from "@/lib/localized";
import { SectionTitle } from "@/components/marketing/section-title";
import { Reveal } from "@/components/ui/reveal";

const linkMap = { starter: "/product", pro: "/product", elite: "/contact" };

export function PricingSection({ tiers }: { tiers: PricingTier[] }) {
  return (
    <section className="container py-14 sm:py-18 md:py-24" id="pricing">
      <SectionTitle
        eyebrow="Offer Ladder"
        title="Choose your protection level"
        description="Start with core protection or deploy the full freelancer revenue system. Every tier builds on the previous level."
      />
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {tiers.map((tier, idx) => (
          <Reveal key={tier.id} delay={idx * 0.07}>
            <Card className={`h-full p-6 sm:p-7 ${tier.featured ? "border-brand/70 bg-gradient-to-b from-brand/15 via-card/90 to-card/80 shadow-glow" : ""}`}>
              {tier.featured ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Best Value</p> : null}
              <p className="text-sm font-medium text-brand-soft">{localizeText(tier.name)}</p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">{localizeText(tier.label)}</h3>
              <p className="mt-3 text-3xl font-semibold text-foreground">{parsePriceAmount(localizeText(tier.price)) ? formatCurrency(parsePriceAmount(localizeText(tier.price))!) : localizeText(tier.price)}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{localizeText(tier.description)}</p>
              {tier.audience ? <p className="mt-2 text-xs leading-6 text-muted">{localizeText(tier.audience)}</p> : null}
              <ul className="mt-5 space-y-2.5">
                {(tier.includes || []).map((line) => (
                  <li key={typeof line === "string" ? line : JSON.stringify(line)} className="flex items-start gap-2 text-sm leading-6 text-muted"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" /><span>{localizeText(line)}</span></li>
                ))}
              </ul>
              {tier.benefit ? <p className="mt-4 text-sm font-medium text-foreground">{localizeText(tier.benefit)}</p> : null}
              <LinkButton href={tier.ctaUrl || linkMap[tier.id as keyof typeof linkMap] || "/product"} className="mt-6 h-11 w-full" variant={tier.featured ? "default" : "secondary"}>{localizeText(tier.cta)}</LinkButton>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
