import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { headingStyles, type HeadingSize } from "../../../lib";
import { Button } from "../button";
import { Filter, Plus } from "lucide-react";
export type PageHeadingProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  size?: HeadingSize;
  leftActions?: ReactNode;
};

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
  className,
  size = "4xl",
  leftActions,
  ...props
}: PageHeadingProps) {
  return (
    <header
      {...props}
      className={cn(
        "flex flex-wrap items-end justify-between gap-6",
        className,
      )}
    >
      <div className="flex flex-col items-baseline gap-4">
        <div>
          {eyebrow && (
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-wax-red">
              {eyebrow}
            </p>
          )}
          <h1
            className={cn(
              "m-0 max-w-[18ch] font-display leading-[0.95] ",
              headingStyles[size].heading,
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-3 max-w-prose text-wax-muted",
                headingStyles[size].description,
              )}
            >
              {description}
            </p>
          )}
        </div>
        {leftActions}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
