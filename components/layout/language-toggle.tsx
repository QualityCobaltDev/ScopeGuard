"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { t } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, toggleLocale } = useLocale();
  const dict = t(locale);
  return (
    <button
      type="button"
      aria-label={dict.localeLabel}
      onClick={toggleLocale}
      className="inline-flex h-9 items-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-semibold text-foreground transition hover:border-brand/70"
    >
      <Languages className="h-3.5 w-3.5" />
      {locale === "en" ? dict.english : dict.khmer}
    </button>
  );
}
