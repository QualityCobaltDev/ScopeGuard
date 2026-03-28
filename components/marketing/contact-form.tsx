"use client";

import type React from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("No sensitive data, legal documents, or credentials in this form.");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("loading");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        message: fd.get("message"),
        company: fd.get("company")
      })
    });

    const data = (await res.json().catch(() => ({}))) as { message?: string };

    if (res.ok) {
      setStatus("success");
      setMessage(data.message || "Message sent. We'll follow up shortly.");
      form.reset();
      return;
    }

    setStatus("error");
    setMessage(data.message || "Unable to send. Please try again.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input required name="name" placeholder="Name" className="h-12" />
      <Input required name="email" type="email" placeholder="Work email" className="h-12" />
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <Textarea required minLength={10} name="message" placeholder="How can we help?" className="min-h-36" />
      <Button className="h-12 w-full" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Sending..." : "Send message"}
      </Button>
      <p className="text-xs leading-6 text-muted">{message}</p>
    </form>
  );
}
