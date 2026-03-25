import type { Metadata } from "next";

export const siteUrl = "https://elevareai.store";
const siteName = "Elevare AI";

export function createMetadata({
  title,
  description,
  path = "/"
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const url = new URL(path, siteUrl).toString();

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale: "en_US",
      type: "website",
      images: [{ url: "/og/cover.svg", width: 1200, height: 630, alt: `${siteName} Open Graph Image` }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og/cover.svg"]
    },
    alternates: { canonical: url }
  };
}
