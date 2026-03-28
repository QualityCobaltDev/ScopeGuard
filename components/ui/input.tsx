import type React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-border/90 bg-white/70 px-3.5 text-sm text-foreground shadow-[inset_0_1px_2px_rgba(13,34,72,0.04)] placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:bg-white/5",
        props.className
      )}
    />
  );
}
