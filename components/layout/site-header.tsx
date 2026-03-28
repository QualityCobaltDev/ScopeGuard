"use client";

import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LinkButton } from "@/components/ui/button";
import { SessionActions } from "@/components/layout/session-actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { checkoutLinks } from "@/lib/checkout";
import type { SiteContent } from "@/lib/content-types";
import type { SessionUser } from "@/lib/auth";
import { localizeText } from "@/lib/localized";
import { t } from "@/lib/i18n";

export function SiteHeader({ site, user }: { site: SiteContent; user: SessionUser | null }) {
  const dict = t();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/82 backdrop-blur-xl">
      <div className="container flex h-[4.5rem] items-center justify-between gap-3 sm:h-[5rem]">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-1 text-foreground transition hover:bg-white/20 dark:hover:bg-white/5"
          onClick={closeMenu}
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/40 bg-gradient-to-br from-brand/20 via-brand/10 to-transparent text-brand-soft shadow-[0_8px_20px_rgba(88,121,240,0.28)] transition duration-300 group-hover:scale-[1.03]">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold tracking-tight sm:text-lg">ScopeGuard</span>
            <span className="block truncate text-[10px] font-medium tracking-[0.14em] text-muted sm:text-[11px]">Provided by ElevareAI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-all duration-300 hover:bg-white/20 hover:text-foreground dark:hover:bg-white/5"
            >
              <span className="relative inline-block after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-brand-soft after:transition-transform after:duration-300 hover:after:scale-x-100">
                {localizeText(item.label)}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground transition duration-300 hover:border-brand/70 hover:shadow-[0_10px_30px_rgba(73,110,232,0.22)] lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden lg:flex lg:items-center lg:gap-2">
            {user ? (
              <SessionActions user={user} />
            ) : (
              <>
                <LinkButton href="/admin/signin" size="sm" variant="secondary">{dict.adminSignin}</LinkButton>
                <LinkButton href={checkoutLinks.pro} size="sm">{dict.getAccess}</LinkButton>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              id="mobile-nav"
              className="fixed inset-x-3 top-[5.15rem] z-50 rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur lg:hidden"
              initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="grid gap-1">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm text-foreground transition hover:bg-white/5"
                  >
                    {localizeText(item.label)}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 grid gap-2 border-t border-border pt-4">
                {user ? (
                  <SessionActions user={user} mobile onAction={closeMenu} />
                ) : (
                  <>
                    <LinkButton href="/admin/signin" size="default" variant="secondary" className="w-full" onClick={closeMenu}>{dict.adminSignin}</LinkButton>
                    <LinkButton href={checkoutLinks.pro} size="default" className="w-full" onClick={closeMenu}>{dict.getAccess}</LinkButton>
                  </>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
