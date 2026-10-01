import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export function EmptyState({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("ui-empty-state grid min-h-40 place-items-center rounded-lg border border-dashed border-wax-line p-8 text-center", className)} />;
}
