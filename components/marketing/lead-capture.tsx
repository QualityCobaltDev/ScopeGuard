"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function LeadCapture() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    setDone(true);
    setEmail("");
  }

  return (
    <section className="container pb-24">
      <Card className="grid gap-6 p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-soft">Lead Magnet</p>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">Get the Freelancer Protection Checklist</h3>
          <p className="mt-2 text-sm text-muted">
            A concise pre-client checklist to avoid weak terms, vague scope, and payment friction.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="your email"
            aria-label="Email"
          />
          <Button className="w-full" type="submit">
            {done ? "You're in — check your inbox" : "Send me the checklist"}
          </Button>
          <p className="text-xs text-muted">By subscribing, you agree to receive practical business emails from ScopeGuard.</p>
        </form>
      </Card>
    </section>
  );
}
