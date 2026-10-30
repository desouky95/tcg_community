import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";

export function PublicFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<"footer">) {
  return (
    <footer
      {...props}
      className={cn(
        "flex flex-col gap-4 bg-wax-navy px-gutter py-6 text-sm text-wax-paper sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <img src="/brand/next-pull-logo-white.svg" alt="Next Pull" className="h-auto w-32" />
      <span>Every card has a next move.</span>
      <span>© 2026 · Egypt first, collectors everywhere.</span>
    </footer>
  );
}
