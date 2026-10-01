import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";
import { NativeLink } from "../native-link";
import type { LinkComponent } from "../types";

export type CategoryRowProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
  name: string;
  index: number;
  Link?: LinkComponent;
};

export function CategoryRow({ href, name, index, Link = NativeLink, className, ...props }: CategoryRowProps) {
  return <Link {...props} href={href} className={cn("focus-ring grid min-h-20 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-wax-line px-4 py-3 hover:bg-wax-navy hover:text-wax-paper sm:grid-cols-[4rem_minmax(0,1fr)_auto]", className)}>
    <span className="font-mono text-utility text-wax-red">{String(index + 1).padStart(2, "0")}</span>
    <strong className="font-display text-xl uppercase">{name}</strong>
    <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
  </Link>;
}
