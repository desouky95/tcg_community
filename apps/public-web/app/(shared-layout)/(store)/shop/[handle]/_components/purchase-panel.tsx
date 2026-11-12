"use client";
import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import { useCart } from "../../../../../../src/providers/CartProvider";

function availability(variant: HttpTypes.StoreProductVariant | undefined) {
  if (!variant) return "unavailable";
  if (variant.manage_inventory === false || variant.allow_backorder) return "available";
  if (typeof variant.inventory_quantity !== "number") return "unknown";
  return variant.inventory_quantity > 0 ? "available" : "unavailable";
}
export function PurchasePanel({ productId, variants, regionId }: { productId: string; variants: HttpTypes.StoreProductVariant[]; regionId?: string }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? "");
  const [quantityInput, setQuantityInput] = useState("1");
  const quantityId = useId();
  const [error, setError] = useState("");
  const { add, pending } = useCart();
  const selected = variants.find(variant => variant.id === selectedId);
  const status = availability(selected);
  const price = selected?.calculated_price;
  const priceAvailable = price?.calculated_amount != null && !!price.currency_code && !!regionId;
  const max = selected?.manage_inventory && !selected.allow_backorder && typeof selected.inventory_quantity === "number" ? Math.min(99, selected.inventory_quantity) : 99;
  const quantity = quantityInput === "" ? NaN : Number(quantityInput);
  const validQuantity = Number.isSafeInteger(quantity) && quantity >= 1 && quantity <= max;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !priceAvailable || status !== "available" || !validQuantity) return;
    setError("");
    const message = await add(productId, selected.id, quantity);
    if (message) setError(message);
  }
  return <form method="post" action="/api/cart/add" onSubmit={submit} className="mt-6 space-y-6">
    <input type="hidden" name="product_id" value={productId} />
    {variants.length <= 1 && <input type="hidden" name="variant_id" value={selectedId} />}
    <div>{priceAvailable ? <p className="font-display text-3xl font-semibold">{new Intl.NumberFormat("en", { style: "currency", currency: price.currency_code! }).format(price.calculated_amount!)}</p> : <p className="font-semibold">Price unavailable</p>}
      <p className="mt-3 text-sm font-semibold">{status === "available" ? (selected?.allow_backorder && selected.manage_inventory !== false && (selected.inventory_quantity ?? 0) <= 0 ? "Available to order" : "In stock") : status === "unknown" ? "Availability unavailable" : "Out of stock"}</p>
    </div>
    {variants.length > 1 && <label className="block text-sm font-semibold">Variant<select name="variant_id" value={selectedId} onChange={event => { setSelectedId(event.target.value); setQuantityInput("1"); setError(""); }} className="mt-2 min-h-12 w-full rounded-md border border-wax-line bg-white px-3">{variants.map(variant => <option key={variant.id} value={variant.id}>{variant.title}</option>)}</select></label>}
    <div>
      <label htmlFor={quantityId} className="block text-sm font-semibold">Quantity</label>
      <div className="mt-2 flex flex-wrap items-stretch gap-3">
        <div className="flex h-14 shrink-0 items-stretch rounded-md border border-wax-line bg-white">
          <button type="button" aria-label="Decrease quantity" disabled={pending || status !== "available" || (Number.isFinite(quantity) && quantity <= 1)} onClick={() => setQuantityInput(String(validQuantity ? quantity - 1 : 1))} className="focus-ring grid w-11 place-items-center rounded-s-md disabled:cursor-not-allowed disabled:opacity-40"><Minus size={16} aria-hidden="true" /></button>
          <input id={quantityId} name="quantity" type="number" min={1} max={Math.max(1, max)} step={1} value={quantityInput} onChange={event => setQuantityInput(event.target.value)} className="focus-ring w-12 min-w-0 border-0 bg-transparent p-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          <button type="button" aria-label="Increase quantity" disabled={pending || status !== "available" || (Number.isFinite(quantity) && quantity >= max)} onClick={() => setQuantityInput(String(validQuantity ? quantity + 1 : 1))} className="focus-ring grid w-11 place-items-center rounded-e-md disabled:cursor-not-allowed disabled:opacity-40"><Plus size={16} aria-hidden="true" /></button>
        </div>
        <button type="submit" name="add_to_cart" disabled={pending || !priceAvailable || status !== "available" || !validQuantity} className="focus-ring min-h-14 min-w-36 flex-1 rounded-md bg-accent-500 px-5 font-display font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Adding…" : status === "unavailable" ? "Unavailable" : "Add to cart"}</button>
      </div>
    </div>
    {error && <p role="alert" className="text-sm font-semibold">{error}</p>}
  </form>;
}
