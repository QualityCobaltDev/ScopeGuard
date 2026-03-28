import type React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/85 bg-card/90 shadow-[0_14px_40px_rgba(13,34,72,0.07)] backdrop-blur supports-[backdrop-filter]:bg-card/70 transition duration-300 hover:border-brand/35 hover:shadow-[0_20px_48px_rgba(52,88,193,0.14)]",
        className
      )}
      {...props}
    />
  );
}
