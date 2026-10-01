"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "../../../lib/cn";
import { ToggleGroup } from "../../radix/toggle-group";

export type ViewToggleProps = {
  value: "grid" | "list";
  onChange: (value: "grid" | "list") => void;
  labels?: { grid: string; list: string };
  className?: string;
};

export function ViewToggle({ value, onChange, labels = { grid: "Grid view", list: "List view" }, className }: ViewToggleProps) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(next) => next && onChange(next as "grid" | "list")}
      className={cn("inline-flex rounded-md border border-wax-line bg-wax-input/70 p-1", className)}
      aria-label="Choose view"
    >
      <ToggleGroup.Item value="grid" aria-label={labels.grid}><LayoutGrid aria-hidden="true" className="size-4" /></ToggleGroup.Item>
      <ToggleGroup.Item value="list" aria-label={labels.list}><List aria-hidden="true" className="size-4" /></ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
