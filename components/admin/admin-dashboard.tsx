"use client";

import { useEffect, useMemo, useState } from "react";
import type { CollectionName } from "@/lib/content-types";

const collections: CollectionName[] = ["site", "products", "pricing", "testimonials", "faq", "resources"];

export function AdminDashboard() {
  const [selected, setSelected] = useState<CollectionName>("site");
  const [data, setData] = useState<unknown>(null);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");

  async function load(collection: CollectionName) {
    const res = await fetch(`/api/content/${collection}`);
    const json = await res.json();
    setData(json);
    setDraft(JSON.stringify(json, null, 2));
  }

  useEffect(() => {
    load(selected);
  }, [selected]);

  const isArray = useMemo(() => Array.isArray(data), [data]);

  const saveWhole = async () => {
    setStatus("Saving...");
    const payload = JSON.parse(draft);
    const method = selected === "site" || selected === "products" ? "POST" : "POST";
    if (isArray) {
      // replace array by deleting/recreating on server side with PUT for deterministic persistence
      await fetch(`/api/content/${selected}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload })
      });
    } else {
      await fetch(`/api/content/${selected}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
    await load(selected);
    setStatus("Saved.");
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Content Admin</h1>
        <button onClick={logout} className="rounded-lg border border-border px-3 py-2 text-sm">Logout</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {collections.map((collection) => (
          <button key={collection} onClick={() => setSelected(collection)} className={`rounded-lg px-3 py-2 text-sm ${selected === collection ? "bg-brand text-black" : "border border-border"}`}>
            {collection}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-sm text-muted">Edit {selected} content (JSON), then save. Frontend updates immediately.</p>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="h-[520px] w-full rounded-lg border border-border bg-background p-3 font-mono text-xs" />
        <div className="mt-3 flex items-center gap-3">
          <button onClick={saveWhole} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-black">Save {selected}</button>
          <span className="text-sm text-muted">{status}</span>
        </div>
      </div>
    </div>
  );
}
