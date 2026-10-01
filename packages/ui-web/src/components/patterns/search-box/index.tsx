"use client";

import { Search } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Input } from "../../primitives/input";

export type SearchBoxProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
};

export function SearchBox({ id, value, onChange, placeholder = "Search cards, sets, or sellers", label = "Search marketplace", className }: SearchBoxProps) {
  return (
    <label className={cn("relative block min-w-0 flex-1", className)} htmlFor={id}>
      <Search aria-hidden="true" className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-wax-muted" />
      <span className="sr-only">{label}</span>
      <Input id={id} type="search" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="ps-10" />
    </label>
  );
}
