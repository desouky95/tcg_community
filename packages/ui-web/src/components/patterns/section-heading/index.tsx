import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";

export function SectionHeading({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "mb-8 flex flex-col items-start justify-between gap-4 border-b border-wax-line pb-5 md:flex-row md:items-end md:gap-8 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:leading-none md:[&_h2]:text-title [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-wax-muted",
        className,
      )}
    />
  );
}
