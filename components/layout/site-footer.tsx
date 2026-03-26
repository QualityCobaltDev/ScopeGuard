import Link from "next/link";
import type { SiteContent } from "@/lib/content-types";

export function SiteFooter({ site }: { site: SiteContent }) {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[#060a13]">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-foreground">{site.name}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">{site.footer.description}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {site.footer.companyLinks.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {site.footer.legalLinks.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
            <li><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
