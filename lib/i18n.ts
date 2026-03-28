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
    pricingChoose: "Choose your protection level",
    pricingOneTime: "One-time payment",
    pricingInstantAccess: "Instant access",
    termsTitle: "Terms of Service",
    privacyTitle: "Privacy Policy",
    refundTitle: "Refund Policy",
    lastUpdated: "Last updated"
  },
  km: {
    localeLabel: "ភាសា",
    english: "EN",
    khmer: "KM",
    navCompany: "ក្រុមហ៊ុន",
    navLegal: "ច្បាប់",
    allRightsReserved: "រក្សាសិទ្ធិគ្រប់យ៉ាង។",
    adminSignin: "ចូលប្រព័ន្ធអ្នកគ្រប់គ្រង",
    getAccess: "ទទួលបានការចូលប្រើ",
    searchResources: "ស្វែងរកឯកសារ",
    searchResourcesPlaceholder: "ស្វែងរកតាមចំណងជើង ឬសេចក្ដីសង្ខេប",
    category: "ប្រភេទ",
    all: "ទាំងអស់",
    accountRequired: "ត្រូវការគណនី",
    publicDownload: "ទាញយកសាធារណៈ",
    openResource: "បើកឯកសារ",
    noResources: "មិនមានឯកសារដែលត្រូវនឹងការស្វែងរកទេ។",
    leadMagnet: "ឯកសារឥតគិតថ្លៃ",
    sending: "កំពុងផ្ញើ...",
    contactSend: "ផ្ញើសារ",
    contactSending: "កំពុងផ្ញើ...",
    contactSafety: "សូមកុំបញ្ចូលទិន្នន័យរសើប ឬឯកសារផ្នែកច្បាប់ក្នុងទម្រង់នេះ។",
    contactName: "ឈ្មោះ",
    contactEmail: "អ៊ីមែលការងារ",
    contactMessage: "តើយើងអាចជួយអ្វីបាន?",
    contactResponseWindow: "រយៈពេលឆ្លើយតប",
    homeFinalCta: "អំពាវនាវចុងក្រោយ",
    painPointsEyebrow: "បញ្ហាសំខាន់",
    painPointsTitle: "អ្នកសេរីភាគច្រើនបាត់បង់ចំណេញនៅ ៣ ចំណុចដូចគ្នា",
    painPointsDescription: "កិច្ចព្រមព្រៀងមិនច្បាស់ ដែនកំណត់ការងារមិនរឹងមាំ និងទំនាក់ទំនងមិនស្របគ្នា ធ្វើឲ្យចំណេញធ្លាក់ចុះ។",
    solutionEyebrow: "ដំណោះស្រាយ",
    solutionTitle: "ប្រព័ន្ធប្រតិបត្តិការពេញលេញសម្រាប់អ្នកសេរី",
    solutionDescription: "ScopeGuard រួមបញ្ចូលការការពារផ្នែកច្បាប់ជាមួយឧបករណ៍អនុវត្ត ដើម្បីឲ្យដំណើរការរបស់អ្នកមានស្តង់ដារខ្ពស់។",
    testimonialsEyebrow: "មតិយោបល់",
    testimonialsTitle: "ភស្តុតាងពីអ្នកសេរីដែលប្រើ ScopeGuard",
    faqEyebrow: "សំណួរញឹកញាប់",
    faqTitle: "សំណួរមុនសម្រេចចិត្ត",
    resourcesEyebrow: "ធនធាន",
    resourcesTitle: "បង្កើតបណ្ណាល័យធនធានគុណភាពខ្ពស់របស់អ្នក",
    resourcesDescription: "ស្វែងរក តម្រៀប និងទាញយកឯកសារដែលរៀបចំសម្រាប់អ្នកសេរី។",
    contactEyebrow: "ទំនាក់ទំនង",
    productOverviewEyebrow: "ទិដ្ឋភាពទូទៅផលិតផល",
    productOverviewTitle: "ក្របខណ្ឌពេញលេញសម្រាប់ការការពារ និងចំណូលអ្នកសេរី",
    productOverviewDescription: "ឯកសារទាំងអស់ត្រូវបានរចនាឡើងដើម្បីបង្កើនការពារ និងជួយឲ្យបទពិសោធន៍អតិថិជនកាន់តែប្រសើរ។",
    pricingBestValue: "ជម្រើសល្អបំផុត",
    pricingOfferLadder: "កម្រិតផលិតផល",
    pricingChoose: "ជ្រើសរើសកម្រិតការពាររបស់អ្នក",
    pricingOneTime: "បង់តែម្តង",
    pricingInstantAccess: "ចូលប្រើភ្លាមៗ",
    termsTitle: "លក្ខខណ្ឌសេវាកម្ម",
    privacyTitle: "គោលការណ៍ឯកជនភាព",
    refundTitle: "គោលការណ៍សងប្រាក់",
    lastUpdated: "អាប់ដេតចុងក្រោយ"
  }
} as const;

export type UiKey = keyof typeof uiDictionary.en;
export type UiDictionary = Record<UiKey, string>;

export function t(locale: Locale): UiDictionary {
  return (uiDictionary[locale] ?? uiDictionary.en) as UiDictionary;
}

export function translateUi(locale: Locale, key: UiKey): string {
  return t(locale)[key] || t("en")[key];
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
