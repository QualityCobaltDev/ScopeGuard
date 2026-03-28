import { BadgeCheck, Wallet, Shield, Sparkles, ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { PricingSection } from "@/components/marketing/pricing-section";
import { LeadCapture } from "@/components/marketing/lead-capture";
import { SectionTitle } from "@/components/marketing/section-title";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { LinkButton } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { readCollection } from "@/lib/content-store";
import { readManagedPageContent, isPageLive } from "@/lib/managed-page-rendering";
import { ManagedPageSections } from "@/components/marketing/managed-page-sections";
import { localizeText } from "@/lib/localized";
import { t } from "@/lib/i18n";

const defaultHomeMetadata = {
  title: "Freelancer Protection Systems",
  description: "ScopeGuard combines contracts, proposals, invoicing systems, and communication frameworks to protect freelance revenue.",
  path: "/"
};

export async function generateMetadata() {
  const { page } = await readManagedPageContent("home");
  return createMetadata({
    ...defaultHomeMetadata,
    title: page?.seoTitle || defaultHomeMetadata.title,
    description: page?.seoDescription || defaultHomeMetadata.description
  });
}

export default async function HomePage() {
  const dict = t();
  const [{ page, sections }, site, faq, testimonials, products, pricing] = await Promise.all([
    readManagedPageContent("home"),
    readCollection("site"),
    readCollection("faq"),
    readCollection("testimonials"),
    readCollection("products"),
    readCollection("pricing")
  ]);

  if (!isPageLive(page)) notFound();

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

        <section className="container pb-10 pt-4 sm:pb-14 sm:pt-6 md:pb-20 md:pt-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {site.stats.map((stat) => (
              <Card key={stat.label} className="p-5 sm:p-6">
                <p className="text-2xl font-semibold text-foreground sm:text-3xl">{localizeText(stat.value)}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{localizeText(stat.label)}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container py-10 sm:py-12 md:py-14">
          <SectionTitle
            eyebrow={dict.painPointsEyebrow}
            title={dict.painPointsTitle}
            description={dict.painPointsDescription}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {site.painPoints.map((point, index) => {
              const Icon = [Wallet, Shield, Sparkles][index] || Sparkles;
              return (
                <Card key={point.id} className="p-5 sm:p-6">
                  <Icon className="h-5 w-5 text-brand-soft" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{localizeText(point.title)}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{localizeText(point.description)}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container py-10 sm:py-12 md:py-20">
          <SectionTitle
            eyebrow={dict.solutionEyebrow}
            title={dict.solutionTitle}
            description={dict.solutionDescription}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {products.highlights.map((item) => (
              <Card key={item.id} className="p-5 sm:p-6">
                <BadgeCheck className="h-5 w-5 text-accent" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{localizeText(item.title)}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{localizeText(item.description)}</p>
              </Card>
            ))}
          </div>
        </section>

        <PricingSection tiers={pricing.filter((tier) => tier.visible !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))} />

        <section className="container py-10 sm:py-12 md:py-20">
          <SectionTitle eyebrow={dict.testimonialsEyebrow} title={dict.testimonialsTitle} />
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {testimonials.filter((item) => item.visible !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => (
              <Card key={item.id} className="p-5 sm:p-6">
                <p className="text-sm leading-7 text-muted">“{localizeText(item.quote)}”</p>
                <p className="mt-5 font-medium text-foreground">{localizeText(item.name)}</p>
                <p className="text-xs text-muted">{localizeText(item.role)}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container py-10 sm:py-12 md:py-20">
          <SectionTitle eyebrow={dict.faqEyebrow} title={dict.faqTitle} />
          <div className="mx-auto max-w-3xl">
            <Accordion
              items={faq.filter((item) => item.visible !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((item) => ({
                question: localizeText(item.question),
                answer: localizeText(item.answer),
              }))}
            />
          </div>
        </section>

        <section className="container pb-10 sm:pb-12 md:pb-14">
          <Card className="flex flex-col items-stretch justify-between gap-5 p-5 sm:p-7 md:flex-row md:items-center md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Final CTA</p>
              <h3 className="mt-2 text-balance text-xl font-semibold text-foreground sm:text-2xl">{localizeText(site.finalCta.title)}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{localizeText(site.finalCta.description)}</p>
            </div>
            <LinkButton href={site.finalCta.buttonLink} size="lg" className="h-12 w-full gap-2 md:w-auto">
              {localizeText(site.finalCta.buttonLabel)} <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </Card>
        </section>

        <ManagedPageSections sections={sections} />
        <LeadCapture />
      </div>
    </div>
  );
}
