"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpenText, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ResourceItem } from "@/lib/content-types";
import { localizeText } from "@/lib/localized";

export function ResourcesLibrary({ resources }: { resources: ResourceItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(resources.map((item) => localizeText(item.category))))], [resources]);

  const filtered = useMemo(
    () =>
      resources.filter((item) => {
        const q = query.toLowerCase();
        const title = localizeText(item.title).toLowerCase();
        const summary = localizeText(item.summary).toLowerCase();
        const cat = localizeText(item.category);
        const matchesText = !q || title.includes(q) || summary.includes(q);
        const matchesCategory = category === "all" || cat === category;
        return matchesText && matchesCategory;
      }),
    [resources, query, category]
  );

  return (
    <div>
      <div className="mb-5 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_220px]">
        <label className="grid gap-1 text-sm">
          <span className="text-muted">Search resources</span>
          <input className="h-11 rounded-lg border border-border bg-background px-3" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or summary" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-muted">Category</span>
          <select className="h-11 rounded-lg border border-border bg-background px-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((entry) => (
              <option key={entry} value={entry}>{entry === "all" ? "all" : entry}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {filtered.map((item) => (
          <Card key={item.id} className="p-5 sm:p-6">
            <BookOpenText className="h-5 w-5 text-brand-soft" />
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-brand-soft">{item.label}</p>
            <h3 className="mt-2 text-base font-semibold sm:text-lg">{localizeText(item.title)}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{localizeText(item.summary)}</p>
            <p className="mt-2 text-xs text-muted">Category: {localizeText(item.category)}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
              {item.accessType === "account_required" ? <><Lock className="h-3 w-3" /> Account required</> : "Public download"}
            </p>
            <a href={`/api/resources/download/${item.id}`} className="mt-5 inline-flex min-h-10 items-center gap-1 text-sm text-foreground">
              {localizeText(item.ctaLabel) || "Open resource"} <ArrowUpRight className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </div>
      {!filtered.length ? <p className="mt-4 text-sm text-muted">{dict.noResources}</p> : null}
    </div>
  );
}
