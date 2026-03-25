export type PricingTier = {
  id: "starter" | "pro" | "premium";
  name: string;
  label: string;
  price: string;
  description: string;
  featured?: boolean;
  includes: string[];
  cta: string;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    label: "Freelancer Protection System",
    price: "$49",
    description: "Core legal and onboarding assets to lock down scope and payment expectations.",
    includes: [
      "Service Agreement templates",
      "NDA template",
      "Client onboarding form",
      "Payment protection terms",
      "Quick-start implementation guide"
    ],
    cta: "Buy Starter"
  },
  {
    id: "pro",
    name: "Pro",
    label: "Freelancer Business Toolkit",
    price: "$99",
    description: "Everything in Starter plus client-facing assets to increase close rates and speed payments.",
    includes: [
      "Everything in Starter",
      "Invoice templates",
      "Proposal templates",
      "Pricing calculator"
    ],
    cta: "Get Pro",
    featured: true
  },
  {
    id: "premium",
    name: "Premium",
    label: "Freelancer Revenue System",
    price: "$149",
    description: "The complete growth and protection stack for stronger negotiations and upsell execution.",
    includes: [
      "Everything in Pro",
      "Client acquisition scripts",
      "Negotiation templates",
      "Upsell frameworks",
      "Client communication scripts"
    ],
    cta: "Go Premium"
  }
];
