"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "../../../lib/cn";
import { useFieldControl } from "../../../lib/field-context";

export function AuthInput({ className, invalid, ...props }: ComponentPropsWithRef<"input"> & { invalid?: boolean }) {
  const control = useFieldControl({ ...props, "aria-invalid": invalid ?? props["aria-invalid"] });
  return (
    <input
      {...control}
      className={cn("min-h-control min-w-0 flex-1 border-0 bg-transparent px-3.5 text-wax-ink outline-none placeholder:text-wax-muted aria-invalid:text-danger-600", className)}
    />
  );
}
