import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/content/site";
import { checkoutLinks } from "@/lib/checkout";
import { LinkButton } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <ShieldCheck className="h-5 w-5 text-brand-soft" />
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <LinkButton href={checkoutLinks.pro} size="sm">
          Get Instant Access
        </LinkButton>
      </div>
    </header>
  );
}
