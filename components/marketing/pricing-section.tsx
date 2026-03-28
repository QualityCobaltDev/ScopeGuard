import { Check } from "lucide-react";
import { checkoutLinks } from "@/lib/checkout";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { SectionTitle } from "@/components/marketing/section-title";
import type { PricingTier } from "@/lib/content-types";

const linkMap = { starter: checkoutLinks.starter, pro: checkoutLinks.pro, premium: checkoutLinks.premium } as const;

export function PricingSection({ tiers }: { tiers: PricingTier[] }) {
  return (
    <section className="container py-20" id="pricing">
      <SectionTitle
        eyebrow="Offer Ladder"
        title="Choose your protection level"
        description="Start with core protection or deploy the full freelancer revenue system. Every tier builds on the previous level."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id} className={`p-6 ${tier.featured ? "border-brand/70 bg-gradient-to-b from-brand/15 via-card/90 to-card/80 shadow-glow" : ""}`}>
            {tier.featured ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Best Value</p> : null}
            <p className="text-sm font-medium text-brand-soft">{tier.name}</p>
            <h3 className="mt-1 text-xl font-semibold text-foreground">{tier.label}</h3>
            <p className="mt-3 text-3xl font-semibold text-foreground">{tier.price}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{tier.description}</p>
            {tier.audience ? <p className="mt-2 text-xs text-muted">{tier.audience}</p> : null}
            <ul className="mt-6 space-y-3">
              {tier.includes.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-muted"><Check className="mt-0.5 h-4 w-4 text-accent" /><span>{line}</span></li>
              ))}
            </ul>
            {tier.benefit ? <p className="mt-4 text-sm font-medium text-foreground">{tier.benefit}</p> : null}
            <LinkButton href={tier.ctaUrl || linkMap[tier.id as keyof typeof linkMap] || "/product"} className="mt-7 w-full" variant={tier.featured ? "default" : "secondary"}>{tier.cta}</LinkButton>
          </Card>
        ))}
      </div>
    </section>
  );
}
