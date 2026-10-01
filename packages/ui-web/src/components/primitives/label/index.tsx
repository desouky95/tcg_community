import type { LabelHTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn("text-xs font-extrabold text-wax-ink", className)} />;
}
