import { checkoutLinks } from "@/lib/checkout";
import { LinkButton } from "@/components/ui/button";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-3 z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="rounded-2xl border border-border bg-card/90 p-2.5 shadow-lg backdrop-blur">
        <LinkButton href={checkoutLinks.pro} className="h-12 w-full" size="lg">
          Buy Now — Get Instant Access
        </LinkButton>
      </div>
    </div>
  );
}
