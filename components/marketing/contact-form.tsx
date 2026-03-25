"use client";

import type React from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input required name="name" placeholder="Name" />
      <Input required name="email" type="email" placeholder="Work email" />
      <Textarea required name="message" placeholder="How can we help?" />
      <Button className="w-full" type="submit">
        Send message
      </Button>
      <p className="text-xs text-muted">
        {sent ? "Message queued. We'll follow up shortly." : "No sensitive data, legal documents, or credentials in this form."}
      </p>
    </form>
  );
}
