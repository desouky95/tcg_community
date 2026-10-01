import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";

export function PublicFooter({ className, ...props }: ComponentPropsWithoutRef<"footer">) {
  return <footer {...props} className={cn("flex flex-col gap-4 bg-wax-navy px-gutter py-6 font-mono text-utility text-wax-paper sm:flex-row sm:items-center sm:justify-between", className)}>
    <span className="font-display text-xl font-extrabold text-wax-gold">TCG NEXUS</span>
    <span>Cards bring people closer.</span>
    <span>© 2026 · Egypt first, collectors everywhere.</span>
  </footer>;
}
