import type { HTMLAttributes } from "react";
import { cn } from "../../../lib/cn";

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "muted" | "accent";
  interactive?: boolean;
};

export function Surface({ className, tone = "default", interactive = false, ...props }: SurfaceProps) {
  return (
    <div
      {...props}
      data-tone={tone}
      data-interactive={interactive}
      className={cn(
        "border border-wax-line bg-wax-card text-card-foreground",
        tone === "muted" && "bg-wax-input/70",
        tone === "accent" && "border-ring/40",
        interactive && "transition-[border-color,box-shadow,transform] duration-150 motion-safe:hover:-translate-y-px hover:border-ring/50 hover:shadow-soft",
        className,
      )}
    />
  );
}
