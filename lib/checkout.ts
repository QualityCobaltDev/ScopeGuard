export const checkoutLinks = {
  starter: process.env.NEXT_PUBLIC_CHECKOUT_STARTER_URL || "https://elevareai.store/product",
  pro: process.env.NEXT_PUBLIC_CHECKOUT_PRO_URL || "https://elevareai.store/product",
  premium: process.env.NEXT_PUBLIC_CHECKOUT_PREMIUM_URL || "https://elevareai.store/product",
  leadMagnet: process.env.NEXT_PUBLIC_LEAD_MAGNET_URL || "https://elevareai.store/resources"
} as const;

export const contactEmail = "contact@elevareai.store";
