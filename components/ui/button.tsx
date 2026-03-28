import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-brand to-brand-dark text-white shadow-[0_14px_34px_rgba(67,102,224,0.3)] hover:translate-y-[-1px] hover:shadow-[0_20px_42px_rgba(67,102,224,0.4)]",
        secondary:
          "border border-border/90 bg-card/90 text-foreground shadow-[0_8px_24px_rgba(12,26,62,0.08)] hover:border-brand/40 hover:bg-white/80 dark:hover:bg-white/10",
        ghost: "text-muted hover:bg-white/5 hover:text-foreground"
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-6",
        sm: "h-9 px-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export function LinkButton({
  href,
  children,
  className,
  variant,
  size,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </Link>
  );
}
