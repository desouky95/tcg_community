import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";
import { NativeLink } from "../native-link";
import type { LinkComponent } from "../types";

export type ListingPreviewProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  name: string;
  set: string;
  condition: string;
  image: string;
  availability?: string;
  Link?: LinkComponent;
};

export function ListingPreview({ name, set, condition, image, availability = "Available", Link = NativeLink, className, ...props }: ListingPreviewProps) {
  return <Link {...props} className={cn("focus-ring block border border-wax-line bg-card text-card-foreground hover:border-wax-red hover:shadow-lifted motion-safe:transition motion-safe:hover:-translate-y-1", className)}>
    <div className="relative aspect-[0.78] overflow-hidden">
      <img src={image} alt="" className="size-full object-cover" loading="lazy" />
      <span className="absolute start-3 top-3 bg-accent-500 px-2 py-1 font-mono text-utility uppercase text-white">{availability}</span>
    </div>
    <div className="flex flex-col gap-3 p-3 sm:flex-row sm:justify-between sm:p-4">
      <div className="min-w-0"><strong className="block font-display uppercase">{name}</strong><span className="mt-1 block font-mono text-utility text-wax-muted">{set}</span></div>
      <span className="font-mono text-utility uppercase text-wax-red sm:text-end">{condition}</span>
    </div>
  </Link>;
}
