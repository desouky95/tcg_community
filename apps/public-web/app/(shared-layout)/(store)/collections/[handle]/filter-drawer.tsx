"use client";
import { Dialog } from "@tcg/ui-web/components/radix/dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { CollectionFilters } from "../../../../../src/lib/collection-queries";

export function FilterDrawer({ filters, priceAvailable, stockAvailable, currency }: { filters: CollectionFilters; priceAvailable: boolean; stockAvailable: boolean; currency?: string }) {
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(filters.min);
  const [max, setMax] = useState(filters.max);
  const invalid = !!min && !!max && Number(min) > Number(max);
  const count = Number(Boolean(filters.min || filters.max)) + Number(Boolean(filters.availability));
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild><button className="focus-ring inline-flex min-h-11 items-center gap-3 border-b-2 border-primary-500 py-2 font-display text-sm font-semibold"><SlidersHorizontal size={17} aria-hidden="true" /> Filter &amp; Sort {count > 0 && <span>({count})</span>}</button></Dialog.Trigger>
    <Dialog.Content placement="end" className="p-0" aria-describedby={undefined}>
      <div className="flex items-center justify-between border-b border-wax-line p-6"><Dialog.Title>Filter &amp; Sort</Dialog.Title><Dialog.Close asChild><button className="focus-ring grid size-11 place-items-center" aria-label="Close filters"><X size={21} /></button></Dialog.Close></div>
      <form method="get" className="flex flex-1 flex-col" onSubmit={(event) => { if (invalid) event.preventDefault(); }}>
        <div className="flex-1 space-y-8 p-6">
          <label className="block font-display font-semibold" htmlFor="collection-sort">Sort by</label>
          <select id="collection-sort" name="sort" defaultValue={filters.sort} className="mt-2 min-h-12 w-full rounded-md border border-wax-line bg-white px-3 font-body"><option value="newest">Date, new to old</option><option value="oldest">Date, old to new</option><option value="title">Alphabetically, A–Z</option><option value="-title">Alphabetically, Z–A</option>{priceAvailable && <><option value="price">Price, low to high</option><option value="-price">Price, high to low</option></>}</select>
          {priceAvailable && <fieldset className="border-t border-wax-line pt-6"><legend className="font-display font-semibold">Price{currency ? ` (${currency.toUpperCase()})` : ""}</legend><div className="mt-4 grid grid-cols-2 gap-3"><label className="text-sm">Min<input name="min" type="number" min="0" step="any" value={min} onChange={(e) => setMin(e.target.value)} aria-invalid={invalid} aria-describedby={invalid ? "price-range-error" : undefined} placeholder="0" className="mt-2 min-h-12 w-full rounded-md border border-wax-line bg-white px-3" /></label><label className="text-sm">Max<input name="max" type="number" min="0" step="any" value={max} onChange={(e) => setMax(e.target.value)} aria-invalid={invalid} aria-describedby={invalid ? "price-range-error" : undefined} placeholder="Any" className="mt-2 min-h-12 w-full rounded-md border border-wax-line bg-white px-3" /></label></div>{invalid && <p id="price-range-error" role="alert" className="mt-3 text-sm text-primary-500">Minimum price must not exceed maximum price.</p>}</fieldset>}
          {stockAvailable && <fieldset className="border-t border-wax-line pt-6"><legend className="font-display font-semibold">Availability</legend><div className="mt-4 grid gap-4">{[["", "All products"], ["in-stock", "In stock"], ["out-of-stock", "Out of stock"]].map(([value, label]) => <label key={value} className="flex min-h-8 items-center gap-3"><input type="radio" name="availability" value={value} defaultChecked={filters.availability === value} />{label}</label>)}</div></fieldset>}
        </div>
        <div className="flex gap-3 border-t border-wax-line p-6"><a href="?" className="focus-ring flex min-h-12 flex-1 items-center justify-center rounded-md border border-primary-500 font-semibold">Clear all</a><button type="submit" className="focus-ring min-h-12 flex-1 rounded-md bg-primary-500 px-5 font-semibold text-white">Apply</button></div>
      </form>
    </Dialog.Content>
  </Dialog.Root>;
}
