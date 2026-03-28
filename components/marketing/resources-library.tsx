"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpenText, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ResourceItem } from "@/lib/content-types";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { localizeText } from "@/lib/localized";

export function ResourcesLibrary({ resources, locale }: { resources: ResourceItem[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const dict = t(locale);

  const categories = useMemo(() => ["all", ...Array.from(new Set(resources.map((item) => localizeText(item.category, locale))))], [resources, locale]);

  const filtered = useMemo(
    () =>
      resources.filter((item) => {
        const q = query.toLowerCase();
        const title = localizeText(item.title, locale).toLowerCase();
        const summary = localizeText(item.summary, locale).toLowerCase();
        const cat = localizeText(item.category, locale);
        const matchesText = !q || title.includes(q) || summary.includes(q);
        const matchesCategory = category === "all" || cat === category;
        return matchesText && matchesCategory;
      }),
    [resources, query, category, locale]
  );

  return (
    <div>
      <div className="mb-5 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_220px]">
        <label className="grid gap-1 text-sm">
          <span className="text-muted">{dict.searchResources}</span>
          <input className="h-11 rounded-lg border border-border bg-background px-3" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={dict.searchResourcesPlaceholder} />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-muted">{dict.category}</span>
          <select className="h-11 rounded-lg border border-border bg-background px-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((entry) => (
              <option key={entry} value={entry}>{entry === "all" ? dict.all : entry}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {filtered.map((item) => (
          <Card key={item.id} className="p-5 sm:p-6">
            <BookOpenText className="h-5 w-5 text-brand-soft" />
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-brand-soft">{item.label}</p>
            <h3 className="mt-2 text-base font-semibold sm:text-lg">{localizeText(item.title, locale)}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{localizeText(item.summary, locale)}</p>
            <p className="mt-2 text-xs text-muted">{dict.category}: {localizeText(item.category, locale)}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
              {item.accessType === "account_required" ? <><Lock className="h-3 w-3" /> {dict.accountRequired}</> : dict.publicDownload}
            </p>
            <a href={`/api/resources/download/${item.id}`} className="mt-5 inline-flex min-h-10 items-center gap-1 text-sm text-foreground">
              {localizeText(item.ctaLabel, locale) || dict.openResource} <ArrowUpRight className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </div>
      {!filtered.length ? <p className="mt-4 text-sm text-muted">{dict.noResources}</p> : null}
    </div>
  );
}
