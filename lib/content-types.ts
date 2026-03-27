export type NavItem = { href: string; label: string };
export type Stat = { label: string; value: string };
export type BasicItem = { id: string; title: string; description: string };

export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  contactEmail: "contact@elevareai.store";
  nav: NavItem[];
  stats: Stat[];
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaLink: string;
    secondaryCtaLabel: string;
    secondaryCtaLink: string;
  };
  painPoints: BasicItem[];
  finalCta: { title: string; description: string; buttonLabel: string; buttonLink: string };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    sections: { id: string; title: string; body: string }[];
  };
  footer: {
    description: string;
    companyLinks: NavItem[];
    legalLinks: NavItem[];
  };
  contact: { headline: string; description: string; responseWindow: string };
  legal: { privacy: string[]; terms: string[]; refund: string[] };
};

export type PricingTier = {
  id: string;
  name: string;
  label: string;
  price: string;
  description: string;
  includes: string[];
  cta: string;
  ctaUrl?: string;
  featured?: boolean;
  audience?: string;
  benefit?: string;
  sortOrder?: number;
  visible?: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating?: number;
  sortOrder?: number;
  visible?: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
  visible?: boolean;
};

export type ProductContent = {
  highlights: BasicItem[];
  deliverables: string[];
  fit: string;
  bonuses: string[];
};

export type ResourceVisibility = "public" | "gated" | "internal";

export type ResourceItem = {
  id: string;
  title: string;
  label: "Guide" | "Worksheet" | "Template" | "Checklist" | "Download";
  category: string;
  summary: string;
  description?: string;
  status: "draft" | "published";
  fileId?: string;
  externalUrl?: string;
  ctaLabel: string;
  sortOrder: number;
  visibility: ResourceVisibility;
  thumbnailUrl?: string;
};

export type ContentMap = {
  site: SiteContent;
  pricing: PricingTier[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  products: ProductContent;
  resources: ResourceItem[];
};

export type CollectionName = keyof ContentMap;
