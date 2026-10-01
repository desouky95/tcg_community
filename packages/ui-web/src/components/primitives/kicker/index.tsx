import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export function Kicker({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={cn(
        "ui-kicker m-0 text-xs font-extrabold uppercase tracking-[0.08em] text-wax-red",
        className,
      )}
    />
  );
}
