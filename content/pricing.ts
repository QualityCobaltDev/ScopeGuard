export type PricingTier = {
  id: "starter" | "pro" | "premium";
  name: string;
  label: string;
  price: "$49" | "$99" | "$149";
  description: string;
  featured?: boolean;
  includes: string[];
  cta: "Buy Now / Get Instant Access";
};

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    label: "Freelancer Protection System",
    price: "$49",
    description: "Entry-level protection to prevent bad clients, scope creep, and payment friction.",
    includes: [
      "Service Agreement Templates",
      "Payment Protection Terms",
      "NDA Template",
      "Client Onboarding Form",
      "Quick Start Guide"
    ],
    cta: "Buy Now / Get Instant Access"
  },
  {
    id: "pro",
    name: "Pro",
    label: "Freelancer Business Toolkit",
    price: "$99",
    description: "Everything in Starter plus systems that improve workflow and pricing clarity.",
    includes: ["Everything in Starter", "Invoice Templates", "Proposal Templates", "Pricing Calculator"],
    cta: "Buy Now / Get Instant Access"
  },
  {
    id: "premium",
    name: "Premium",
    label: "Freelancer Revenue System",
    price: "$149",
    description: "Everything in Pro plus growth assets for deal value and closing power.",
    includes: ["Everything in Pro", "Client Acquisition Scripts", "Negotiation Templates", "Upsell Frameworks", "Communication Scripts"],
    cta: "Buy Now / Get Instant Access",
    featured: true
  }
];
