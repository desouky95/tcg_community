"use client";

import { Search } from "lucide-react";
import { useId, useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";
import { Button } from "../../primitives/button";
import { Input } from "../../primitives/input";

export type SearchRailProps = Omit<
  ComponentPropsWithoutRef<"form">,
  "onSubmit" | "onChange"
> & {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  popularQueries?: readonly string[];
  inputId?: string;
  submitLabel?: string;
};
export function SearchRail({
  label = "Search catalogues",
  placeholder = "Search cards, sets, or characters",
  defaultValue = "",
  value,
  onValueChange,
  onSearch,
  popularQueries = [],
  inputId,
  submitLabel = "Search",
  className,
  action = "/checklists",
  ...props
}: SearchRailProps) {
  const generatedId = useId();
  const id = inputId ?? generatedId;
  const [localValue, setLocalValue] = useState(defaultValue);
  const current = value ?? localValue;
  return (
    <form
      {...props}
      action={action}
      method="get"
      role="search"
      className={cn("w-full min-w-0", className)}
      onSubmit={
        onSearch
          ? (event) => {
              event.preventDefault();
              onSearch(current);
            }
          : undefined
      }
    >
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-center gap-2 border-2 border-wax-line bg-card p-1.5 text-card-foreground">
        <Search
          aria-hidden="true"
          className="ms-2 size-5 shrink-0 text-wax-muted"
        />
        <Input
          id={id}
          name="q"
          type="search"
          placeholder={placeholder}
          value={current}
          onChange={(event) => {
            setLocalValue(event.target.value);
            onValueChange?.(event.target.value);
          }}
          className="min-w-0 flex-1 border-0 bg-transparent px-1"
        />
        <Button type="submit" className="shrink-0">
          {submitLabel}
        </Button>
      </div>
      {popularQueries.length > 0 && (
        <div
          className="mt-3 flex flex-wrap gap-2"
          aria-label="Popular searches"
        >
          {popularQueries.map((query) => (
            <Button
              key={query}
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full bg-card"
              onClick={() => {
                setLocalValue(query);
                onValueChange?.(query);
                if (onSearch) onSearch(query);
                else
                  window.location.assign(
                    `${action}?q=${encodeURIComponent(query)}`,
                  );
              }}
            >
              {query}
            </Button>
          ))}
        </div>
      )}
    </form>
  );
}
