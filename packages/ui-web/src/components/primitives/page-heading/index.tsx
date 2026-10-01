import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";

export type PageHeadingProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
  className,
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
      <div>
        {eyebrow && (
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-wax-red">
            {eyebrow}
          </p>
        )}
        <h1 className="m-0 max-w-[18ch] font-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-prose text-wax-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
