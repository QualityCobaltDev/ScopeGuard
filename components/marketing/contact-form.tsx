"use client";

import type React from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function ContactForm({ locale }: { locale: Locale }) {
  const dict = t(locale);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>(dict.contactSafety);

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
      setMessage(data.message || (locale === "km" ? "បានផ្ញើសាររួចហើយ។ យើងនឹងឆ្លើយតបឆាប់ៗនេះ។" : "Message sent. We'll follow up shortly."));
      form.reset();
      return;
    }

    setStatus("error");
    setMessage(data.message || (locale === "km" ? "មិនអាចផ្ញើបានទេ។ សូមព្យាយាមម្តងទៀត។" : "Unable to send. Please try again."));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input required name="name" placeholder={dict.contactName} className="h-12" />
      <Input required name="email" type="email" placeholder={dict.contactEmail} className="h-12" />
      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      <Textarea required minLength={10} name="message" placeholder={dict.contactMessage} className="min-h-36" />
      <Button className="h-12 w-full" disabled={status === "loading"} type="submit">
        {status === "loading" ? dict.contactSending : dict.contactSend}
      </Button>
      <p className="text-xs leading-6 text-muted">{message}</p>
    </form>
  );
}
