"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content-types";
import { localizeText } from "@/lib/localized";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)"
  }
};

export function Hero({ site }: { site: SiteContent }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-16 md:pb-28 md:pt-24">
      <div
        className="absolute inset-0 bg-mesh opacity-85 [mask-image:linear-gradient(to_bottom,black_0%,black_74%,transparent_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,154,255,0.2)_0%,rgba(124,154,255,0)_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 -bottom-24 h-56 bg-gradient-to-b from-transparent via-background/70 to-background"
        aria-hidden
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container relative"
      >
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            variants={item}
            className="inline-flex items-center rounded-full border border-brand/40 bg-brand/12 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-soft shadow-[0_8px_26px_rgba(89,119,236,0.2)] sm:px-4 sm:text-xs"
          >
            {localizeText(site.hero.badge)}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 text-balance text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:mt-8 sm:text-6xl md:text-7xl"
          >
            <span className="gradient-text">{localizeText(site.hero.title)}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8"
          >
            {localizeText(site.hero.description)}
          </motion.p>

          <motion.div variants={item} className="relative mt-9 sm:mt-10">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/16 blur-3xl sm:w-[29rem]"
              aria-hidden
            />
            <div className="relative grid gap-3 sm:flex sm:items-center sm:justify-center">
              <LinkButton href={site.hero.primaryCtaLink} size="lg" className="h-12 w-full gap-2 sm:w-auto">
                {localizeText(site.hero.primaryCtaLabel)} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </LinkButton>
              <LinkButton href={site.hero.secondaryCtaLink} variant="secondary" size="lg" className="h-12 w-full gap-2 sm:w-auto">
                {localizeText(site.hero.secondaryCtaLabel)} <Download className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </LinkButton>
            </div>
          </motion.div>

          <motion.p
            variants={item}
            className="mx-auto mt-4 max-w-xl text-xs leading-6 text-muted sm:text-sm"
          >
            Contracts, pricing frameworks, and delivery systems designed for premium client operations.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
