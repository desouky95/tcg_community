import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { buttonStyles } from "../../../lib/component-styles";

export function MarketplaceHeroAction({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} className={buttonStyles({ className: "border-wax-paper bg-wax-paper text-wax-ink hover:border-wax-gold hover:bg-wax-gold" })}>{children}<ArrowRight aria-hidden="true" className="size-4" /></a>;
}
