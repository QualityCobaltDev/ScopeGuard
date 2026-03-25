import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { readCollection } from "@/lib/content-store";
import { getCurrentUser } from "@/lib/user-store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elevare AI | Premium Digital Growth Systems",
  description: "Elevare AI helps digital businesses launch premium offer systems and convert with confidence.",
  metadataBase: new URL("https://elevareai.store")
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, user] = await Promise.all([readCollection("site"), getCurrentUser()]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    email: "contact@elevareai.store",
    sameAs: []
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteHeader site={site} user={user} />
        <main>{children}</main>
        <SiteFooter site={site} />
        <MobileStickyCta />
        <Script id="schema-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </body>
    </html>
  );
}
