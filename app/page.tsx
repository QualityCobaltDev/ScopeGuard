import { Shield, Sparkles, Wallet, BadgeCheck, ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { LeadCapture } from "@/components/marketing/lead-capture";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { LinkButton } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import { faqItems } from "@/content/faq";
import { testimonials } from "@/content/testimonials";
import { productHighlights } from "@/content/products";
import { checkoutLinks } from "@/lib/checkout";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Freelancer Protection Systems",
  description:
    "Stop revenue leaks with premium contracts, proposals, invoice systems, and communication frameworks built for freelancers.",
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="container py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {siteConfig.stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-8">
        <SectionTitle
          eyebrow="Pain points"
          title="Freelancers lose margin in the same 3 places"
          description="Weak agreements, uncontrolled scope, and fragmented communication are silent profit killers."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [Wallet, "Late or unpaid invoices", "Without concrete payment terms, collection becomes emotional and inconsistent."],
            [Shield, "Scope creep loops", "Projects expand while budget and timeline stay fixed, collapsing profitability."],
            [Sparkles, "Low-authority client process", "Inconsistent docs signal amateur operations and attract difficult clients."]
          ].map(([Icon, title, desc]) => (
            <Card key={title as string} className="p-6">
              <Icon className="h-5 w-5 text-brand-soft" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{title as string}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{desc as string}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <SectionTitle
          eyebrow="Solution"
          title="A complete freelancer operating system"
          description="ScopeGuard combines legal protection with business execution assets so your process feels authoritative from day one."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {productHighlights.map((item) => (
            <Card key={item.title} className="p-6">
              <BadgeCheck className="h-5 w-5 text-accent" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <PricingSection />

      <section className="container py-20">
        <SectionTitle eyebrow="Testimonials" title="Credibility in progress" description="Replace these labeled placeholders with real buyer proof as sales begin." />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="p-6">
              <p className="text-sm leading-7 text-muted">“{item.quote}”</p>
              <p className="mt-6 font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted">{item.role}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <SectionTitle eyebrow="FAQ" title="Questions before purchase" />
        <div className="mx-auto max-w-3xl">
          <Accordion items={faqItems} />
        </div>
      </section>

      <section className="container pb-14">
        <Card className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Final CTA</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">Protect your next project before it starts.</h3>
            <p className="mt-2 text-sm text-muted">Deploy ScopeGuard once, then run every client engagement with confidence.</p>
          </div>
          <LinkButton href={checkoutLinks.premium} size="lg" className="gap-2">
            Build my revenue system <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </Card>
      </section>

      <LeadCapture />
    </>
  );
}
