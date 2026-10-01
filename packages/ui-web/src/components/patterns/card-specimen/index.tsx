import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";
import { NativeLink } from "../native-link";
import type { LinkComponent } from "../types";

export type CardSpecimenProps = ComponentPropsWithoutRef<"article"> & {
  name: string; set: string; condition: string; image: string; href: string;
  Link?: LinkComponent; actionLabel?: string; position?: 1 | 2 | 3;
};
export function CardSpecimen({ name, set, condition, image, href, Link = NativeLink, actionLabel = "View card", position, className, ...props }: CardSpecimenProps) {
  return <article {...props} className={cn(position ? `wax-card wax-card-${position}` : "border border-wax-line bg-card text-card-foreground", className)}>
    <img src={image} alt={`${name} card`} className="aspect-[3/4] w-full object-cover" />
    <div className="wax-card-caption">
      <strong>{name}</strong><span>{set}</span>
      <span>{condition}</span>
      {(!position || position === 2) && <Link href={href} className="focus-ring inline-flex min-h-control-sm items-center font-bold underline">{actionLabel}<span className="sr-only">: {name}</span></Link>}
    </div>
  </article>;
}
