"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { localizeText } from "@/lib/localized";

const defaults = {
  isActive: true,
  publicTitle: "Get the Freelancer Protection Checklist",
  publicDescription: "A concise pre-client checklist to avoid weak terms, vague scope, and payment friction.",
  buttonLabel: "Send me the checklist",
  successMessage: "You're in — check your inbox for your resources."
};

type LeadMagnetPublicConfig = typeof defaults;
type LeadMagnetPublicResponse = Partial<LeadMagnetPublicConfig> & { [key: string]: unknown };
type LeadSubmitResponse = { message?: unknown; error?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function safeText(value: unknown, fallback: string) {
  if (typeof value === "string") return value;
  return fallback;
}

function toPublicConfig(data: unknown): LeadMagnetPublicConfig {
  if (!isRecord(data)) return defaults;
  return {
    isActive: typeof data.isActive === "boolean" ? data.isActive : defaults.isActive,
    publicTitle: safeText(data.publicTitle, defaults.publicTitle),
    publicDescription: safeText(data.publicDescription, defaults.publicDescription),
    buttonLabel: safeText(data.buttonLabel, defaults.buttonLabel),
    successMessage: safeText(data.successMessage, defaults.successMessage)
  };
}

export function LeadCapture() {
  const [config, setConfig] = useState(defaults);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("By subscribing, you agree to receive practical business emails from ScopeGuard.");

  useEffect(() => {
    fetch("/api/lead", { method: "GET" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LeadMagnetPublicResponse | null) => setConfig(toPublicConfig(data)))
      .catch(() => null);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "homepage_lead_capture", company: "" })
    });

    const data = (await res.json().catch(() => ({}))) as LeadSubmitResponse;
    if (res.ok) {
      setStatus("success");
      setMessage(safeText(data.message, config.successMessage));
      setEmail("");
      return;
    }

    setStatus("error");
    setMessage(safeText(data.error, "Unable to deliver resources right now. Please try again."));
  }

  return (
    <section className="container pb-16 sm:pb-20 md:pb-24">
      <Card className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1.2fr_1fr] md:items-center md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Lead Magnet</p>
          <h3 className="mt-2 text-balance text-xl font-semibold text-foreground sm:text-2xl">{localizeText(config.publicTitle)}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{localizeText(config.publicDescription)}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="your@email.com" aria-label="Email" className="h-12" />
          <Button className="h-12 w-full" disabled={status === "loading" || !config.isActive} type="submit">
            {status === "loading" ? "Sending..." : localizeText(config.buttonLabel)}
          </Button>
          <p className={`text-xs leading-6 ${status === "error" ? "text-red-400" : "text-muted"}`}>{message}</p>
        </form>
      </Card>
    </section>
  );
}
