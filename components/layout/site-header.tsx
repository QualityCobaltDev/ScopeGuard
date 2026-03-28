"use client";

import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { SessionActions } from "@/components/layout/session-actions";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { checkoutLinks } from "@/lib/checkout";
import type { SiteContent } from "@/lib/content-types";
import type { SessionUser } from "@/lib/auth";

export function SiteHeader({ site, user }: { site: SiteContent; user: SessionUser | null }) {
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-2 sm:h-[4.5rem]">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-foreground" onClick={closeMenu}>
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-soft" />
          <span className="truncate text-sm sm:text-base">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-brand/70 lg:hidden"
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
                <LinkButton href="/admin/signin" size="sm" variant="secondary">Admin Sign-in</LinkButton>
                <LinkButton href={checkoutLinks.pro} size="sm">Get Access</LinkButton>
              </>
            )}
          </div>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button aria-label="Close menu overlay" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeMenu} />
          <div id="mobile-nav" className="fixed inset-x-3 top-[4.25rem] z-50 rounded-2xl border border-border bg-card p-4 shadow-2xl lg:hidden">
            <nav className="grid gap-1">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm text-foreground transition hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 grid gap-2 border-t border-border pt-4">
              {user ? (
                <SessionActions user={user} mobile onAction={closeMenu} />
              ) : (
                <>
                  <LinkButton href="/admin/signin" size="default" variant="secondary" className="w-full" onClick={closeMenu}>Admin Sign-in</LinkButton>
                  <LinkButton href={checkoutLinks.pro} size="default" className="w-full" onClick={closeMenu}>Get Access</LinkButton>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
