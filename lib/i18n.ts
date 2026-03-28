export const SUPPORTED_LOCALES = ["en"] as const;
export type Locale = "en";
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "scopeguard-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en";
}

export const uiDictionary = {
  en: {
    localeLabel: "Language",
    english: "EN",
    khmer: "KM",
    navCompany: "Company",
    navLegal: "Legal",
    allRightsReserved: "All rights reserved.",
    adminSignin: "Admin Sign-in",
    getAccess: "Get Access",
    searchResources: "Search resources",
    searchResourcesPlaceholder: "Search by title or summary",
    category: "Category",
    all: "all",
    accountRequired: "Account required",
    publicDownload: "Public download",
    openResource: "Open resource",
    noResources: "No resources match your filters.",
    leadMagnet: "Lead Magnet",
    sending: "Sending...",
    contactSend: "Send message",
    contactSending: "Sending...",
    contactSafety: "No sensitive data, legal documents, or credentials in this form.",
    contactName: "Name",
    contactEmail: "Work email",
    contactMessage: "How can we help?",
    contactResponseWindow: "Response window",
    homeFinalCta: "Final CTA",
    painPointsEyebrow: "Pain points",
    painPointsTitle: "Freelancers lose margin in the same 3 places",
    painPointsDescription: "Weak agreements, uncontrolled scope, and fragmented communication quietly erode profit.",
    solutionEyebrow: "Solution",
    solutionTitle: "A complete freelancer operating system",
    solutionDescription: "ScopeGuard combines legal protection with execution assets so your process feels authoritative from day one.",
    testimonialsEyebrow: "Testimonials",
    testimonialsTitle: "Proof from freelancers using ScopeGuard",
    faqEyebrow: "FAQ",
    faqTitle: "Questions before you commit",
    resourcesEyebrow: "Resources",
    resourcesTitle: "Build your premium growth library",
    resourcesDescription: "Search, filter, and unlock structured downloads built for freelancers.",
    contactEyebrow: "Contact",
    productOverviewEyebrow: "Product Overview",
    productOverviewTitle: "The complete freelancer protection and revenue framework",
    productOverviewDescription: "Every asset is designed to tighten boundaries, improve payment reliability, and elevate your client experience.",
    pricingBestValue: "Best Value",
    pricingOfferLadder: "Offer Ladder",
    pricingChoose: "Choose your protection level"
  }
} as const;

export function t(): (typeof uiDictionary)["en"] {
  return uiDictionary.en;
}

export function formatCurrency(
  value: number,
  _locale: Locale = "en",
  currency: string = "USD",
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...options
  }).format(value);
}
