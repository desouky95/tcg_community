"use client";

import type { ComponentPropsWithRef } from "react";
import { useFieldControl } from "../../../lib/field-context";
import { cn } from "../../../lib/cn";
import {
  controlSizeVariants,
  controlStyles,
  type ControlSize,
} from "../../../lib/component-styles";

type InputProps = Omit<ComponentPropsWithRef<"input">, "size"> & {
  size?: ControlSize;
};
export function Input({ className, size = "md", ...props }: InputProps) {
  const control = useFieldControl(props);
  return (
    <input
      {...control}
      className={cn(
        controlStyles,
        controlSizeVariants[size],
        "w-full px-3.5",
        className,
      )}
    />
  );
}
