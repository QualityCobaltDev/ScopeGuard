import type { Locale } from "@/lib/i18n";

export type LocalizedText = string | { en?: string; km?: string };

export function localizeText(value: LocalizedText | undefined, locale: Locale, fallback = ""): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[locale] || value.en || fallback;
}

export function parsePriceAmount(value: string): number | null {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}
