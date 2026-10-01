"use client";

import type { ComponentPropsWithRef } from "react";
import { useFieldControl } from "../../../lib/field-context";
import { cn } from "../../../lib/cn";
import { controlStyles } from "../../../lib/component-styles";

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  const control = useFieldControl(props);
  return (
    <input
      {...control}
      className={cn(
        "ui-control ui-input",
        controlStyles,
        "w-full px-3.5",
        className,
      )}
    />
  );
}
