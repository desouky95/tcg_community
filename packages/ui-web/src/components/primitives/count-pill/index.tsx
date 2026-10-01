import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export function CountPill({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span {...props} className={cn("inline-flex min-h-6 min-w-7 items-center justify-center rounded-full bg-muted px-2 text-xs font-extrabold tabular-nums text-muted-foreground", className)} />;
}
