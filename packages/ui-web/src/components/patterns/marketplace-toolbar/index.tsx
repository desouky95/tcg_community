"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { ViewToggle } from "../view-toggle";

export type MarketplaceToolbarProps = {
  count: number;
  savedCount?: number;
  view: "grid" | "list";
  onViewChange: (value: "grid" | "list") => void;
  actions?: ReactNode;
};

export function MarketplaceToolbar({ count, savedCount, view, onViewChange, actions }: MarketplaceToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-wax-line py-3">
      <div className="flex items-center gap-2 text-sm text-wax-muted">
        <SlidersHorizontal aria-hidden="true" className="size-4" />
        <strong className="text-wax-ink">{count} listings</strong>
        {typeof savedCount === "number" && <span>{savedCount} saved</span>}
      </div>
      <div className="flex flex-wrap items-center gap-3">{actions}<ViewToggle value={view} onChange={onViewChange} labels={{ grid: "Grid view", list: "List view" }} /></div>
    </div>
  );
}
