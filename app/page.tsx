import { BadgeCheck, Wallet, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { LeadCapture } from "@/components/marketing/lead-capture";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { LinkButton } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";

export const metadata = createMetadata({
  title: "Freelancer Protection Systems",
  description:
    "ScopeGuard combines contracts, proposals, invoicing systems, and communication frameworks to protect freelance revenue.",
  path: "/",
});

export default async function HomePage() {
  const [site, faq, testimonials, products, pricing] = await Promise.all([
    readCollection("site"),
    readCollection("faq"),
    readCollection("testimonials"),
    readCollection("products"),
    readCollection("pricing"),
  ]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-[-8rem] z-0 h-[38rem] bg-[radial-gradient(circle_at_50%_0%,rgba(108,141,255,0.20),transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-[22rem] z-0 h-64 bg-gradient-to-b from-transparent via-background/60 to-background"
        aria-hidden
      />
      <div className="relative z-10">
        <Hero site={site} />
        <section className="container pb-20 pt-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {site.stats.map((stat) => (
              <Card key={stat.label} className="p-6">
                <p className="text-3xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </Card>
            ))}
          </div>
        </section>
        <section className="container py-8">
          <SectionTitle
            eyebrow="Pain points"
            title="Freelancers lose margin in the same 3 places"
            description="Weak agreements, uncontrolled scope, and fragmented communication quietly erode profit."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {site.painPoints.map((point, index) => {
              const Icon = [Wallet, Shield, Sparkles][index] || Sparkles;
              return (
                <Card key={point.id} className="p-6">
                  <Icon className="h-5 w-5 text-brand-soft" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {point.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>
        <section className="container py-20">
          <SectionTitle
            eyebrow="Solution"
            title="A complete freelancer operating system"
            description="ScopeGuard combines legal protection with execution assets so your process feels authoritative from day one."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {products.highlights.map((item) => (
              <Card key={item.id} className="p-6">
                <BadgeCheck className="h-5 w-5 text-accent" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
        <PricingSection tiers={pricing.filter((tier) => tier.visible !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))} />
        <section className="container py-20">
          <SectionTitle
            eyebrow="Testimonials"
            title="Proof from freelancers using ScopeGuard"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.filter((item) => item.visible !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => (
              <Card key={item.id} className="p-6">
                <p className="text-sm leading-7 text-muted">“{item.quote}”</p>
                <p className="mt-6 font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted">{item.role}</p>
              </Card>
            ))}
          </div>
        </section>
        <section className="container py-20">
          <SectionTitle eyebrow="FAQ" title="Questions before you commit" />
          <div className="mx-auto max-w-3xl">
            <Accordion
              items={faq.filter((item) => item.visible !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => ({
                question: item.question,
                answer: item.answer,
              }))}
            />
          </div>
        </section>
        <section className="container pb-14">
          <Card className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">
                Final CTA
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-foreground">
                {site.finalCta.title}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {site.finalCta.description}
              </p>
            </div>
            <LinkButton
              href={site.finalCta.buttonLink}
              size="lg"
              className="gap-2"
            >
              {site.finalCta.buttonLabel} <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </Card>
        </section>
        <LeadCapture />
      </div>
    </div>
  );
}
