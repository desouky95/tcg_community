import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export function Avatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("inline-grid size-10 place-items-center overflow-hidden rounded-full bg-muted font-extrabold text-wax-ink", className)} />;
}
