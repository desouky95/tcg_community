import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "success" | "warning" | "danger";
  size?: "sm" | "md";
};

export function StatusBadge({ className, tone = "success", size = "sm", ...props }: StatusBadgeProps) {
  return (
    <span
      {...props}
      data-tone={tone}
      data-size={size}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-extrabold uppercase tracking-[0.08em]",
        size === "md" && "px-3 py-1.5 text-xs",
        tone === "success" && "border-success-500 bg-success-500/10 text-success-600",
        tone === "warning" && "border-warning-500 bg-warning-500/10 text-warning-600",
        tone === "danger" && "border-danger-500 bg-danger-500/10 text-danger-600",
        className,
      )}
    />
  );
}

export const Badge = StatusBadge;
