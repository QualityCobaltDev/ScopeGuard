import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

export function createMetadata({
  title,
  description,
  path = "/"
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = new URL(path, siteUrl).toString();

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og/cover.svg",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} Open Graph Image`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og/cover.svg"]
    },
    alternates: {
      canonical: url
    }
  };
}
