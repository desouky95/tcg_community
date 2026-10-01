import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../../lib/cn";

export type MarketplaceHeroProps = ComponentPropsWithoutRef<"section"> & {
  title: ReactNode;
  description: ReactNode;
  eyebrow: ReactNode;
  action: ReactNode;
};

export function MarketplaceHero({ title, description, eyebrow, action, className, ...props }: MarketplaceHeroProps) {
  return <section {...props} className={cn("mx-auto grid max-w-[1440px] items-end gap-8 bg-wax-navy px-gutter py-section text-wax-paper lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12", className)}>
    <div>
      <h1 className="m-0 max-w-4xl font-display text-4xl font-extrabold uppercase leading-none sm:text-display lg:text-6xl">{title}</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-wax-paper/85">{description}</p>
    </div>
    <div className="flex flex-col items-start gap-4 lg:items-end"><span className="font-mono text-utility uppercase text-wax-paper/80">{eyebrow}</span>{action}</div>
  </section>;
}
