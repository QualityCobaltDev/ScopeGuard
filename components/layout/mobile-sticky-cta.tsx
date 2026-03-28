"use client";

import { LinkButton } from "@/components/ui/button";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 p-3 backdrop-blur md:hidden">
      <LinkButton href="/product" className="w-full">Buy Now — Get Instant Access</LinkButton>
    </div>
  );
}
