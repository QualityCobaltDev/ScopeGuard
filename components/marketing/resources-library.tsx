"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpenText, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ResourceItem } from "@/lib/content-types";

export function ResourcesLibrary({ resources }: { resources: ResourceItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(resources.map((item) => item.category)))], [resources]);

  const filtered = useMemo(
    () =>
      resources.filter((item) => {
        const q = query.toLowerCase();
        const matchesText = !q || item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q);
        const matchesCategory = category === "all" || item.category === category;
        return matchesText && matchesCategory;
      }),
    [resources, query, category]
  );

  return (
    <div>
      <div className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-[1fr_220px]">
        <label className="grid gap-1 text-sm">
          <span className="text-muted">Search resources</span>
          <input className="rounded-lg border border-border bg-background px-3 py-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or summary" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-muted">Category</span>
          <select className="rounded-lg border border-border bg-background px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((entry) => (
              <option key={entry} value={entry}>{entry}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="p-6">
            <BookOpenText className="h-5 w-5 text-brand-soft" />
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-brand-soft">{item.label}</p>
            <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p>
            <p className="mt-2 text-xs text-muted">Category: {item.category}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
              {item.accessType === "account_required" ? <><Lock className="h-3 w-3" /> Account required</> : "Public download"}
            </p>
            <a href={`/api/resources/download/${item.id}`} className="mt-5 inline-flex items-center gap-1 text-sm text-foreground">
              {item.ctaLabel || "Open resource"} <ArrowUpRight className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
