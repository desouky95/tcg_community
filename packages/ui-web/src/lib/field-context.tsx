"use client";

import { createContext, useContext, type AriaAttributes } from "react";

export type FieldControl = AriaAttributes & { id?: string };
export const FieldContext = createContext<FieldControl>({});

export function useFieldControl<T extends FieldControl>(props: T): T & FieldControl {
  const field = useContext(FieldContext);
  const descriptions = [...new Set(`${field["aria-describedby"] ?? ""} ${props["aria-describedby"] ?? ""}`.split(/\s+/).filter(Boolean))].join(" ");
  return { ...field, ...props, "aria-invalid": props["aria-invalid"] ?? field["aria-invalid"], "aria-describedby": descriptions || undefined };
}
