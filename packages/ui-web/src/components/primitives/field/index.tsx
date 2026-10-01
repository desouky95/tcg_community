"use client";

import { useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { FieldContext } from "../../../lib/field-context";

export type FieldProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, error, invalid = Boolean(error), children, className, ...props }: FieldProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const descriptionId = error ? `${controlId}-error` : hint ? `${controlId}-description` : undefined;
  return (
    <FieldContext.Provider value={{ id: controlId, "aria-describedby": descriptionId, "aria-invalid": invalid || undefined }}>
    <div {...props} className={cn("grid gap-2", className)} data-state={invalid ? "invalid" : "ready"}>
      <label htmlFor={controlId} className="text-xs font-extrabold text-wax-ink">{label}</label>
      <div className="min-w-0">{children}</div>
      {(hint || error) && (
        <p id={descriptionId} className={cn("m-0 text-xs text-wax-muted", error && "text-danger-600")} role={error ? "alert" : undefined}>
          {error || hint}
        </p>
      )}
    </div>
    </FieldContext.Provider>
  );
}
