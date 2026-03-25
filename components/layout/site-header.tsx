import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { checkoutLinks } from "@/lib/checkout";
import type { SiteContent } from "@/lib/content-types";
import type { SessionUser } from "@/lib/auth";

export function SiteHeader({ site, user }: { site: SiteContent; user: SessionUser | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-foreground">
          <ShieldCheck className="h-5 w-5 text-brand-soft" />
          {site.name}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted transition hover:text-foreground">{item.label}</Link>
          ))}
        </nav>
        {user ? (
          <LinkButton href={user.role === "admin" ? "/admin" : "/dashboard"} size="sm">Dashboard</LinkButton>
        ) : (
          <div className="flex items-center gap-2">
            <LinkButton href="/signin" size="sm" variant="secondary">Sign in</LinkButton>
            <LinkButton href={checkoutLinks.pro} size="sm">Get Access</LinkButton>
          </div>
        )}
      </div>
    </header>
  );
}
