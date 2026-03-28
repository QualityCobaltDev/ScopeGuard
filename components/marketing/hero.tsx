"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content-types";

export function Hero({ site }: { site: SiteContent }) {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pb-28">
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
          <p className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-brand-soft">
            {site.hero.badge}
          </p>
          <h1 className="mt-8 text-balance text-4xl font-bold leading-tight text-foreground sm:text-6xl">
            {site.hero.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted">
            {site.hero.description}
          </p>
          <div className="relative mt-10">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/14 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton
                href={site.hero.primaryCtaLink}
                size="lg"
                className="gap-2"
              >
                {site.hero.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton
                href={site.hero.secondaryCtaLink}
                variant="secondary"
                size="lg"
                className="gap-2"
              >
                {site.hero.secondaryCtaLabel} <Download className="h-4 w-4" />
              </LinkButton>
            </div>
            <p className="mt-4 text-xs text-muted">Start with the checklist, then upgrade to the full ScopeGuard system when you’re ready.</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
