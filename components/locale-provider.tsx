"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_COOKIE);
    if (isLocale(stored)) {
      setLocaleState(stored);
      return;
    }
    const cookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1];
    if (isLocale(cookie)) setLocaleState(cookie);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "km" ? "km" : "en";
    window.localStorage.setItem(LOCALE_COOKIE, locale);
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale: (next: Locale) => setLocaleState(next),
      toggleLocale: () => setLocaleState((current) => (current === "en" ? "km" : "en"))
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}
