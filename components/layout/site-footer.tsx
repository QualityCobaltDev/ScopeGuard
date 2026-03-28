"use client";

import Link from "next/link";
import type { SiteContent } from "@/lib/content-types";
import { localizeText } from "@/lib/localized";
import { t } from "@/lib/i18n";

export function SiteFooter({ site }: { site: SiteContent }) {
  const dict = t();
  return (
    <footer className="mt-16 border-t border-border/60 bg-[#050a16] sm:mt-20 md:mt-24">
      <div className="container grid gap-8 py-12 sm:py-14 md:grid-cols-4 md:gap-10 md:py-16">
        <div className="md:col-span-2">
          <p className="text-xl font-semibold text-foreground">ScopeGuard</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-muted">Provided by ElevareAI</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">{localizeText(site.footer.description)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{dict.navCompany}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted sm:mt-4">
            {site.footer.companyLinks.map((item) => (
              <li key={item.href}>
                <Link className="inline-block rounded-md py-1 transition hover:text-foreground" href={item.href}>{localizeText(item.label)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{dict.navLegal}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted sm:mt-4">
            {site.footer.legalLinks.map((item) => (
              <li key={item.href}>
                <Link className="inline-block rounded-md py-1 transition hover:text-foreground" href={item.href}>{localizeText(item.label)}</Link>
              </li>
            ))}
            <li>
              <a className="inline-block rounded-md py-1 transition hover:text-foreground" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 px-4 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} ScopeGuard. All rights reserved.
      </div>
    </footer>
  );
}
