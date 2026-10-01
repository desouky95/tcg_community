"use client";

import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { controlStyles } from "../../../lib/component-styles";

export type FilterSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
};

export function FilterSelect({ id, label, value, onChange, children, className }: FilterSelectProps) {
  return (
    <label className={cn("grid gap-1.5 text-xs font-extrabold text-wax-ink", className)} htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={cn(controlStyles, "min-w-40 px-3.5 font-medium")}>
        {children}
      </select>
    </label>
  );
}
