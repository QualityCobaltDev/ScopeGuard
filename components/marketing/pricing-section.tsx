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

      <div className="grid items-stretch gap-4 [grid-auto-rows:1fr] sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {tiers.map((tier, idx) => {
          const isFeatured = tier.featured;

          return (
            <Reveal key={tier.id} delay={idx * 0.08} className="h-full">
              <Card
                className={`relative flex h-full min-h-[35.5rem] flex-col overflow-hidden p-6 sm:min-h-[36rem] sm:p-7 ${
                  isFeatured
                    ? "border-brand/70 bg-gradient-to-b from-brand/18 via-card/95 to-card/90 shadow-[0_22px_60px_rgba(56,93,204,0.24)]"
                    : ""
                }`}
              >
                {isFeatured ? (
                  <>
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand/16 to-transparent" aria-hidden />
                    <p className="relative mb-3 inline-flex w-fit rounded-full border border-brand/35 bg-brand/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-soft">
                      Best Value
                    </p>
                  </>
                ) : (
                  <div className="mb-8" aria-hidden />
                )}

                <div className="min-h-[5.75rem]">
                  <p className="text-sm font-medium text-brand-soft">{localizeText(tier.name)}</p>
                  <h3 className="mt-1 text-xl font-semibold text-foreground">{localizeText(tier.label)}</h3>
                  <p className="mt-3 text-3xl font-semibold text-foreground">
                    {parsePriceAmount(localizeText(tier.price))
                      ? formatCurrency(parsePriceAmount(localizeText(tier.price))!)
                      : localizeText(tier.price)}
                  </p>
                </div>

                <div className="mt-4 min-h-[6.5rem]">
                  <p className="text-sm leading-7 text-muted">{localizeText(tier.description)}</p>
                  {tier.audience ? <p className="mt-2 text-xs leading-6 text-muted">{localizeText(tier.audience)}</p> : null}
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {(tier.includes || []).map((line) => (
                    <li
                      key={typeof line === "string" ? line : JSON.stringify(line)}
                      className="flex items-start gap-2 text-sm leading-6 text-muted"
                    >
                      <Check className="mt-1 h-4 w-4 shrink-0 text-accent" />
                      <span>{localizeText(line)}</span>
                    </li>
                  ))}
                </ul>

                {tier.benefit ? <p className="mt-4 text-sm font-medium text-foreground">{localizeText(tier.benefit)}</p> : null}

                <div className="mt-6 pt-1">
                  <LinkButton
                    href={tier.ctaUrl || linkMap[tier.id as keyof typeof linkMap] || "/product"}
                    className="h-11 w-full"
                    variant={isFeatured ? "default" : "secondary"}
                  >
                    {localizeText(tier.cta)}
                  </LinkButton>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
