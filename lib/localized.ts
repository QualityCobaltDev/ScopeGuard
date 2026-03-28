export type LocalizedText = string | { en?: string; km?: string };

export function localizeText(value: LocalizedText | undefined, _locale?: unknown, fallback = ""): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.en || fallback;
}

export function parsePriceAmount(value: string): number | null {
  const numeric = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}
