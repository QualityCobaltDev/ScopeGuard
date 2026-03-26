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
  featured?: boolean;
  audience?: string;
  benefit?: string;
};

export type Testimonial = { id: string; quote: string; name: string; role: string };
export type FaqItem = { id: string; question: string; answer: string };
export type ProductContent = {
  highlights: BasicItem[];
  deliverables: string[];
  fit: string;
  bonuses: string[];
};
export type ResourceItem = {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  link: string;
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
