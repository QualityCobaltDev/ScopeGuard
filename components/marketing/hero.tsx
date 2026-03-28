"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content-types";
import { localizeText } from "@/lib/localized";

export function Hero({ site }: { site: SiteContent }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pt-16 md:pb-24 md:pt-24">
      <div
        className="absolute inset-0 bg-mesh opacity-80 [mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 -bottom-24 h-52 bg-gradient-to-b from-transparent via-background/70 to-background"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="container relative"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center rounded-full border border-brand/35 bg-brand/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-soft sm:px-4 sm:text-xs">
            {localizeText(site.hero.badge)}
          </p>
          <h1 className="text-reveal mt-6 text-balance text-4xl font-semibold leading-[1.08] text-foreground sm:mt-8 sm:text-6xl md:text-7xl">
            <span className="gradient-text">{localizeText(site.hero.title)}</span>
          </h1>
          <p className="text-reveal-soft mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {localizeText(site.hero.description)}
          </p>

          <div className="relative mt-9 sm:mt-10">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/16 blur-3xl sm:w-[29rem]"
              aria-hidden
            />
            <div className="relative grid gap-3 sm:flex sm:items-center sm:justify-center">
              <LinkButton href={site.hero.primaryCtaLink} size="lg" className="h-12 w-full gap-2 sm:w-auto">
                {localizeText(site.hero.primaryCtaLabel)} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href={site.hero.secondaryCtaLink} variant="secondary" size="lg" className="h-12 w-full gap-2 sm:w-auto">
                {localizeText(site.hero.secondaryCtaLabel)} <Download className="h-4 w-4" />
              </LinkButton>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-muted sm:text-sm">
              Contracts, pricing frameworks, and delivery systems designed for premium client operations.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
