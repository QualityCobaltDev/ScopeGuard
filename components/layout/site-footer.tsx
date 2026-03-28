"use client";

import Link from "next/link";
import type { SiteContent } from "@/lib/content-types";
import { localizeText } from "@/lib/localized";

export function SiteFooter({ site }: { site: SiteContent }) {
  return (
    <footer className="mt-16 border-t border-border/60 bg-[#060a13] sm:mt-20 md:mt-24">
      <div className="container grid gap-8 py-10 sm:py-12 md:grid-cols-4 md:gap-10 md:py-14">
        <div className="md:col-span-2">
          <p className="text-base font-semibold text-foreground sm:text-lg">{localizeText(site.name)}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">{localizeText(site.footer.description)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Company</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted sm:mt-4">
            {site.footer.companyLinks.map((item) => (
              <li key={item.href}>
                <Link className="inline-block py-1 transition hover:text-foreground" href={item.href}>{localizeText(item.label)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Legal</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted sm:mt-4">
            {site.footer.legalLinks.map((item) => (
              <li key={item.href}>
                <Link className="inline-block py-1 transition hover:text-foreground" href={item.href}>{localizeText(item.label)}</Link>
              </li>
            ))}
            <li>
              <a className="inline-block py-1 transition hover:text-foreground" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 px-4 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {localizeText(site.name)}. All rights reserved.
      </div>
    </footer>
  );
}
