"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { question: string; answer: string };

export function Accordion({ items }: { items: readonly Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="rounded-xl border border-border/80 bg-card/70">
            <button
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-foreground">{item.question}</span>
              <ChevronDown className={cn("h-5 w-5 text-muted transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen ? <p className="px-5 pb-4 text-sm leading-7 text-muted">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
