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
    searchResources: "Search resources",
    category: "Category",
    all: "all",
    accountRequired: "Account required",
    publicDownload: "Public download",
    openResource: "Open resource",
    leadMagnet: "Lead Magnet",
    sending: "Sending...",
    contactSend: "Send message",
    contactSending: "Sending...",
    contactSafety: "No sensitive data, legal documents, or credentials in this form.",
    homeFinalCta: "Final CTA",
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
