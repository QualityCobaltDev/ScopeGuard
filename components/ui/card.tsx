import type React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/85 bg-card/90 shadow-[0_16px_42px_rgba(13,34,72,0.08)] ring-1 ring-white/45 backdrop-blur supports-[backdrop-filter]:bg-card/70 transition duration-300 ease-out hover:-translate-y-[2px] hover:border-brand/45 hover:shadow-[0_24px_56px_rgba(52,88,193,0.18)] dark:ring-white/10",
        className
      )}
      {...props}
    />
  );
}
