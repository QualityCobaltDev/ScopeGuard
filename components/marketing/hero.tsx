"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { checkoutLinks } from "@/lib/checkout";
import { LinkButton } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="absolute inset-0 bg-mesh opacity-90" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="container relative"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-brand-soft">
            Freelancer income protection
          </p>
          <h1 className="mt-8 text-balance text-4xl font-semibold leading-tight text-foreground sm:text-6xl">
            Protect Every Client Engagement Before It Erodes Your <span className="gradient-text">Revenue</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted">
            ScopeGuard gives you the contract terms, proposal assets, invoicing systems, and communication scripts to get paid
            faster, control scope, and operate like a premium studio.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href={checkoutLinks.pro} size="lg" className="gap-2">
              Buy Now / Get Instant Access <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href={checkoutLinks.leadMagnet} variant="secondary" size="lg" className="gap-2">
              Download Free Freelancer Protection Checklist <Download className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
