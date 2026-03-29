"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, ShieldCheck, Clock3, BadgeDollarSign } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { SiteContent } from "@/lib/content-types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

const trustPoints = [
  { icon: ShieldCheck, text: "Protect every project with proven systems" },
  { icon: BadgeDollarSign, text: "Increase paid-in-full client outcomes" },
  { icon: Clock3, text: "Deploy in hours, not weeks" }
];

export function Hero({ site }: { site: SiteContent }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-12 sm:pb-18 sm:pt-14 md:pb-24 md:pt-20">
      <div
        className="absolute inset-0 bg-mesh opacity-80 [mask-image:linear-gradient(to_bottom,black_0%,black_74%,transparent_100%)]"
        aria-hidden
      />

      <motion.div variants={container} initial="hidden" animate="show" className="container relative">
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            variants={item}
            className="inline-flex items-center rounded-full border border-brand/40 bg-brand/12 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-soft sm:px-4 sm:text-xs"
          >
            Built for freelancers, consultants, and micro-agencies
          </motion.p>

          <motion.h1 variants={item} className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Stop scope creep. <span className="gradient-text">Protect revenue.</span>
          </motion.h1>

          <motion.p variants={item} className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
            ScopeGuard gives you contracts, pricing frameworks, and delivery playbooks to close better clients and keep projects profitable.
          </motion.p>

          <motion.div variants={item} className="relative mt-8 sm:mt-9">
            <div className="relative grid gap-3 sm:flex sm:items-center sm:justify-center">
              <LinkButton href={site.hero.primaryCtaLink} size="lg" className="h-12 w-full gap-2 sm:w-auto" aria-label="Get ScopeGuard and protect your client revenue">
                Get ScopeGuard now <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href={site.hero.secondaryCtaLink} variant="secondary" size="lg" className="h-12 w-full gap-2 sm:w-auto" aria-label="Download the free freelancer protection checklist">
                Download free checklist <Download className="h-4 w-4" />
              </LinkButton>
            </div>
          </motion.div>

          <motion.ul variants={item} className="mx-auto mt-5 grid max-w-3xl gap-2 text-left sm:grid-cols-3">
            {trustPoints.map((point) => (
              <li key={point.text} className="rounded-xl border border-border/80 bg-card/85 px-3 py-2.5 text-xs text-muted sm:text-sm">
                <point.icon className="mr-1 inline h-4 w-4 text-brand-soft" aria-hidden />
                {point.text}
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
