export const SUPPORTED_LOCALES = ["en", "km"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "scopeguard-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "km";
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
  },
  km: {
    localeLabel: "ភាសា",
    english: "EN",
    khmer: "KM",
    searchResources: "ស្វែងរកឯកសារ",
    category: "ប្រភេទ",
    all: "ទាំងអស់",
    accountRequired: "ត្រូវការគណនី",
    publicDownload: "ទាញយកសាធារណៈ",
    openResource: "បើកឯកសារ",
    leadMagnet: "ឯកសារឥតគិតថ្លៃ",
    sending: "កំពុងផ្ញើ...",
    contactSend: "ផ្ញើសារ",
    contactSending: "កំពុងផ្ញើ...",
    contactSafety: "សូមកុំបញ្ចូលទិន្នន័យរសើប ឬឯកសារផ្នែកច្បាប់ក្នុងទម្រង់នេះ។",
    homeFinalCta: "អំពាវនាវចុងក្រោយ",
    pricingBestValue: "ជម្រើសល្អបំផុត",
    pricingOfferLadder: "កម្រិតផលិតផល",
    pricingChoose: "ជ្រើសរើសកម្រិតការពាររបស់អ្នក"
  }
} as const;

export function t(locale: Locale) {
  return uiDictionary[locale] ?? uiDictionary.en;
}

export function formatCurrency(
  value: number,
  locale: Locale,
  currency: string = "USD",
  options?: Intl.NumberFormatOptions
) {
  const localeTag = locale === "km" ? "km-KH" : "en-US";
  return new Intl.NumberFormat(localeTag, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...options
  }).format(value);
}
