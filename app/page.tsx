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
  title: "Premium Digital Growth Systems",
  description: "Elevare AI combines strategy, messaging, and conversion systems for premium digital product businesses.",
  path: "/"
});

export default async function HomePage() {
  const [site, faq, testimonials, products, pricing] = await Promise.all([
    readCollection("site"),
    readCollection("faq"),
    readCollection("testimonials"),
    readCollection("products"),
    readCollection("pricing")
  ]);

  return (
    <>
      <Hero site={site} />
      <section className="container py-20"><div className="grid gap-4 sm:grid-cols-3">{site.stats.map((stat) => <Card key={stat.label} className="p-6"><p className="text-3xl font-semibold text-foreground">{stat.value}</p><p className="mt-2 text-sm text-muted">{stat.label}</p></Card>)}</div></section>
      <section className="container py-8">
        <SectionTitle eyebrow="Pain points" title="Premium businesses stall in the same 3 places" description="Fix messaging, margins, and buyer flow with deliberate system design." />
        <div className="grid gap-4 md:grid-cols-3">{site.painPoints.map((point, index) => { const Icon = [Wallet, Shield, Sparkles][index] || Sparkles; return <Card key={point.id} className="p-6"><Icon className="h-5 w-5 text-brand-soft" /><h3 className="mt-4 text-lg font-semibold text-foreground">{point.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{point.description}</p></Card>; })}</div>
      </section>
      <section className="container py-20">
        <SectionTitle eyebrow="Solution" title="A complete premium operating framework" description="Conversion architecture, offer structure, and execution assets in one system." />
        <div className="grid gap-4 md:grid-cols-3">{products.highlights.map((item) => <Card key={item.id} className="p-6"><BadgeCheck className="h-5 w-5 text-accent" /><h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{item.description}</p></Card>)}</div>
      </section>
      <PricingSection tiers={pricing} />
      <section className="container py-20"><SectionTitle eyebrow="Testimonials" title="Proof from operators building digital products" /><div className="grid gap-5 md:grid-cols-3">{testimonials.map((item) => <Card key={item.id} className="p-6"><p className="text-sm leading-7 text-muted">“{item.quote}”</p><p className="mt-6 font-medium text-foreground">{item.name}</p><p className="text-xs text-muted">{item.role}</p></Card>)}</div></section>
      <section className="container py-20"><SectionTitle eyebrow="FAQ" title="Questions before you commit" /><div className="mx-auto max-w-3xl"><Accordion items={faq.map((item) => ({ question: item.question, answer: item.answer }))} /></div></section>
      <section className="container pb-14"><Card className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Final CTA</p><h3 className="mt-2 text-2xl font-semibold text-foreground">{site.finalCta.title}</h3><p className="mt-2 text-sm text-muted">{site.finalCta.description}</p></div><LinkButton href={site.finalCta.buttonLink} size="lg" className="gap-2">{site.finalCta.buttonLabel} <ArrowRight className="h-4 w-4" /></LinkButton></Card></section>
      <LeadCapture />
    </>
  );
}
