import { checkoutLinks } from "@/lib/checkout";
import { LinkButton } from "@/components/ui/button";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-4 md:hidden">
      <div className="rounded-2xl border border-border bg-card/90 p-3 shadow-lg backdrop-blur">
        <LinkButton href={checkoutLinks.pro} className="w-full" size="lg">
          Buy Now — Get Instant Access
        </LinkButton>
      </div>
    </div>
  );
}
