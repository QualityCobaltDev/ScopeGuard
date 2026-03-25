export const checkoutLinks = {
  starter: process.env.NEXT_PUBLIC_CHECKOUT_STARTER_URL || "https://example.com/starter",
  pro: process.env.NEXT_PUBLIC_CHECKOUT_PRO_URL || "https://example.com/pro",
  premium: process.env.NEXT_PUBLIC_CHECKOUT_PREMIUM_URL || "https://example.com/premium",
  leadMagnet:
    process.env.NEXT_PUBLIC_LEAD_MAGNET_URL || "https://example.com/free-freelancer-checklist"
} as const;

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@scopeguard.co";
