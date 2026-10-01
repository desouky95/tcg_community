"use client";

import type { ComponentPropsWithRef } from "react";
import { useFieldControl } from "../../../lib/field-context";
import { cn } from "../../../lib/cn";
import { controlStyles } from "../../../lib/component-styles";

export function Textarea({ className, ...props }: ComponentPropsWithRef<"textarea">) {
  const control = useFieldControl(props);
  return <textarea {...control} className={cn(controlStyles, "min-h-28 w-full resize-y px-3.5 py-3", className)} />;
}
