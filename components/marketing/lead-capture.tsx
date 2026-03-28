"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type LeadConfig = {
  isActive: boolean;
  publicTitle: string;
  publicDescription: string;
  buttonLabel: string;
  successMessage: string;
};

const defaults: LeadConfig = {
  isActive: true,
  publicTitle: "Get the Freelancer Protection Checklist",
  publicDescription: "A concise pre-client checklist to avoid weak terms, vague scope, and payment friction.",
  buttonLabel: "Send me the checklist",
  successMessage: "You're in — check your inbox for your resources."
};

export function LeadCapture() {
  const [email, setEmail] = useState("");
  const [config, setConfig] = useState<LeadConfig>(defaults);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("By subscribing, you agree to receive practical business emails from ScopeGuard.");

  useEffect(() => {
    fetch("/api/lead")
      .then((res) => res.json())
      .then((data) => setConfig({ ...defaults, ...data }))
      .catch(() => undefined);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "homepage_lead_capture", company: "" })
    });

    const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };

    if (res.ok) {
      setStatus("success");
      setMessage(data.message || config.successMessage);
      setEmail("");
      return;
    }

    setStatus("error");
    setMessage(data.error || "Unable to deliver resources right now. Please try again.");
  }

  return (
    <section className="container pb-16 sm:pb-20 md:pb-24">
      <Card className="grid gap-6 p-5 sm:p-6 md:grid-cols-[1.2fr_1fr] md:items-center md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Lead Magnet</p>
          <h3 className="mt-2 text-balance text-xl font-semibold text-foreground sm:text-2xl">{config.publicTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{config.publicDescription}</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="your@email.com" aria-label="Email" className="h-12" />
          <Button className="h-12 w-full" disabled={status === "loading" || !config.isActive} type="submit">
            {status === "loading" ? "Sending..." : config.buttonLabel}
          </Button>
          <p className={`text-xs leading-6 ${status === "error" ? "text-red-400" : "text-muted"}`}>{message}</p>
        </form>
      </Card>
    </section>
  );
}
