import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { ThemeProvider } from "@/components/theme-provider";
import { readCollection } from "@/lib/content-store";
import { getCurrentUser } from "@/lib/user-store";
import { localizeText } from "@/lib/localized";
import { AnalyticsTracker } from "@/components/analytics-tracker";

export const metadata: Metadata = {
  title: "ScopeGuard | Premium Digital Growth Systems",
  description:
    "ScopeGuard helps freelancers protect revenue, reduce scope creep, and standardize client operations with confidence.",
  metadataBase: new URL("https://elevareai.store"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, user] = await Promise.all([
    readCollection("site"),
    getCurrentUser()
  ]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: localizeText(site.name, undefined, "ScopeGuard"),
    url: site.url,
    email: "contact@elevareai.store",
    sameAs: [],
  };

  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ThemeProvider>
          <SiteHeader site={site} user={user} />
          <main id="main-content" className="relative isolate pb-24 md:pb-0">{children}</main>
          <SiteFooter site={site} />
          <MobileStickyCta />
        </ThemeProvider>
        <AnalyticsTracker />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
