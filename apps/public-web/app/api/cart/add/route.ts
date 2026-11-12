import { NextResponse } from "next/server";
import { addCartItem } from "../../../../src/lib/cart-actions";

export async function POST(request: Request) {
  const form = await request.formData();
  const productId = String(form.get("product_id") ?? "");
  const variantId = String(form.get("variant_id") ?? "");
  const quantity = Number(form.get("quantity"));
  const result = await addCartItem(productId, variantId, quantity);
  const destination = new URL(`/shop/${encodeURIComponent(productId)}`, request.url);
  destination.searchParams.set("cart", result.kind === "ready" ? "added" : "error");
  return NextResponse.redirect(destination, 303);
}
