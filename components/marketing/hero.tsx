"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content-types";
import type { Locale } from "@/lib/i18n";
import { localizeText } from "@/lib/localized";

export function Hero({ site, locale }: { site: SiteContent; locale: Locale }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pt-16 md:pb-20 md:pt-20">
      <div
        className="absolute inset-0 bg-mesh opacity-70 [mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 -bottom-24 h-52 bg-gradient-to-b from-transparent via-background/70 to-background"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="container relative"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-soft sm:px-4 sm:text-xs">
            {localizeText(site.hero.badge, locale)}
          </p>
          <h1 className="mt-6 text-balance text-3xl font-semibold leading-tight text-foreground sm:mt-8 sm:text-5xl sm:leading-tight md:text-6xl">
            {localizeText(site.hero.title, locale)}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-muted sm:mt-5 sm:text-lg sm:leading-8">
            {localizeText(site.hero.description, locale)}
          </p>
          <div className="relative mt-8 sm:mt-10">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/14 blur-3xl sm:w-[25rem]"
              aria-hidden
            />
            <div className="relative grid gap-3 sm:flex sm:items-center sm:justify-center">
              <LinkButton href={site.hero.primaryCtaLink} size="lg" className="h-12 w-full gap-2 sm:w-auto">
                {localizeText(site.hero.primaryCtaLabel, locale)} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href={site.hero.secondaryCtaLink} variant="secondary" size="lg" className="h-12 w-full gap-2 sm:w-auto">
                {localizeText(site.hero.secondaryCtaLabel, locale)} <Download className="h-4 w-4" />
              </LinkButton>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-muted sm:text-sm">
              Start with the checklist, then upgrade to the full ScopeGuard system when you’re ready.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
