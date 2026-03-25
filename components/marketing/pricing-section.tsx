import { Check } from "lucide-react";
import { pricingTiers } from "@/content/pricing";
import { checkoutLinks } from "@/lib/checkout";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { SectionTitle } from "@/components/marketing/section-title";

const linkMap = {
  starter: checkoutLinks.starter,
  pro: checkoutLinks.pro,
  premium: checkoutLinks.premium
};

export function PricingSection() {
  return (
    <section className="container py-20" id="pricing">
      <SectionTitle
        eyebrow="Offer Ladder"
        title="Choose your protection level"
        description="Start lean or deploy the full freelancer revenue system. Every tier is editable in one pricing data file."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.id}
            className={`p-6 ${tier.featured ? "border-brand/60 bg-gradient-to-b from-brand/10 via-card/90 to-card/80 shadow-glow" : ""}`}
          >
            <p className="text-sm font-medium text-brand-soft">{tier.name}</p>
            <h3 className="mt-1 text-xl font-semibold text-foreground">{tier.label}</h3>
            <p className="mt-3 text-3xl font-semibold text-foreground">{tier.price}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{tier.description}</p>
            <ul className="mt-6 space-y-3">
              {tier.includes.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 text-accent" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <LinkButton href={linkMap[tier.id]} className="mt-7 w-full" variant={tier.featured ? "default" : "secondary"}>
              {tier.cta}
            </LinkButton>
          </Card>
        ))}
      </div>
    </section>
  );
}
