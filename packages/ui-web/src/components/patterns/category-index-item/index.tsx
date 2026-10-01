import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";
import { NativeLink } from "../native-link";
import type { LinkComponent } from "../types";

export type CategoryIndexItemProps = ComponentPropsWithoutRef<"article"> & {
  name: string;
  href: string;
  index: number;
  entries?: readonly { name: string; href: string }[];
  Link?: LinkComponent;
};

export function CategoryIndexItem({ name, href, index, entries = [], Link = NativeLink, className, ...props }: CategoryIndexItemProps) {
  return <article {...props} className={cn("border-b border-wax-paper/25 py-8 last:border-b-0 lg:min-h-60 lg:border-e lg:border-b-0 lg:px-8 lg:first:ps-0 lg:last:border-e-0 lg:last:pe-0", className)}>
    <span className="mb-4 block font-mono text-utility text-wax-gold lg:mb-8">{String(index + 1).padStart(2, "0")}</span>
    <Link href={href} className="focus-ring flex items-center justify-between gap-4 font-display text-3xl font-extrabold uppercase leading-none"><span>{name}</span><ArrowRight className="size-5 shrink-0 text-wax-gold rtl:rotate-180" aria-hidden="true" /></Link>
    {entries.length > 0 && <ul className="mt-6 grid list-none gap-2">{entries.map(entry => <li key={entry.href}><Link href={entry.href} className="focus-ring text-sm text-wax-paper/80 underline-offset-4 hover:text-wax-paper hover:underline">{entry.name}</Link></li>)}</ul>}
  </article>;
}
