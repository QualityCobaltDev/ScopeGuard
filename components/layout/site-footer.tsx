import Link from "next/link";
import { siteConfig } from "@/content/site";
import { contactEmail } from "@/lib/checkout";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[#060a13]">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold text-foreground">{siteConfig.name}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">
            Premium freelancer protection systems for stronger contracts, cleaner onboarding, and predictable revenue.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/resources">Resources</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Legal</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/refund-policy">Refund Policy</Link></li>
            <li><a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
