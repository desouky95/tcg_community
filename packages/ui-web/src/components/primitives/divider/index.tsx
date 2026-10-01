import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export function Divider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return <hr {...props} className={cn("h-px border-0 bg-wax-line", className)} />;
}
