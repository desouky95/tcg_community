"use server";
import { cookies } from "next/headers";
import { sdk } from "./sdk";
import type { HttpTypes } from "@medusajs/types";
import { resolveStoreRegion } from "./product-detail.server";

const CART_COOKIE = "next_pull_cart";
function isNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 404
  );
}

async function withVariantCounts(cart: HttpTypes.StoreCart) {
  const ids = [
    ...new Set(
      (cart.items ?? [])
        .map((item) => item.product_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const variantCounts: Record<string, number> = {};
  try {
    if (ids.length) {
      const { products } = await sdk.store.product.list({
        id: ids,
        fields: "+variants.id",
        limit: ids.length,
      });
      for (const product of products) {
        if (Array.isArray(product.variants) && product.variants.length > 0)
          variantCounts[product.id] = product.variants.length;
      }
    }
  } catch {
    /* Keep variant text visible when product data is unavailable. */
  }
  return { kind: "ready" as const, cart, variantCounts };
}

export async function readCart() {
  const jar = await cookies();
  const id = jar.get(CART_COOKIE)?.value;
  if (!id) return { kind: "empty" as const };
  try {
    const { cart } = await sdk.store.cart.retrieve(id);
    return await withVariantCounts(cart);
  } catch (error) {
    return isNotFound(error)
      ? { kind: "empty" as const }
      : { kind: "unavailable" as const };
  }
}

export async function addCartItem(
  productId: string,
  variantId: string,
  quantity: number,
) {
  if (
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > 99 ||
    !productId ||
    !variantId
  )
    return {
      kind: "error" as const,
      message: "Choose a valid variant and quantity.",
    };
  try {
    const regionId = await resolveStoreRegion();
    if (!regionId)
      return {
        kind: "error" as const,
        message: "Pricing is unavailable. Please try again later.",
      };
    const { products } = await sdk.store.product.list({
      id: [productId],
      region_id: regionId,
      fields: "*variants.calculated_price,+variants.inventory_quantity",
      limit: 1,
    });
    const variant = products[0]?.variants?.find(
      (item) => item.id === variantId,
    );
    if (
      !variant ||
      variant.calculated_price?.calculated_amount == null ||
      !variant.calculated_price.currency_code
    )
      return {
        kind: "error" as const,
        message: "This variant is unavailable. Please refresh and try again.",
      };
    if (
      variant.manage_inventory !== false &&
      !variant.allow_backorder &&
      (typeof variant.inventory_quantity !== "number" ||
        variant.inventory_quantity < quantity)
    )
      return {
        kind: "error" as const,
        message:
          "The requested quantity is unavailable. Please choose another quantity.",
      };
    const jar = await cookies();
    const existing = jar.get(CART_COOKIE)?.value;
    let cart;
    if (existing) {
      try {
        cart = (await sdk.store.cart.retrieve(existing)).cart;
      } catch (error) {
        if (!isNotFound(error)) throw error;
      }
    }
    if (cart?.completed_at)
      return {
        kind: "error" as const,
        message:
          "This cart is already completed. Please contact support to start a new cart.",
      };
    if (cart && cart.region_id !== regionId)
      return {
        kind: "error" as const,
        message:
          "Your cart uses a different region. Please contact support before adding this item.",
      };
    if (!cart) {
      cart = (await sdk.store.cart.create({ region_id: regionId })).cart;
      jar.set(CART_COOKIE, cart.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    const result = await sdk.store.cart.createLineItem(cart.id, {
      variant_id: variant.id,
      quantity,
    });
    return await withVariantCounts(result.cart);
  } catch {
    return {
      kind: "error" as const,
      message: "We couldn’t add this item. Please try again.",
    };
  }
}

export async function updateCartItem(lineId: string, quantity: number) {
  if (
    !lineId ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > 99
  )
    return {
      kind: "error" as const,
      message: "Choose a quantity between 1 and 99.",
    };
  const id = (await cookies()).get(CART_COOKIE)?.value;
  if (!id)
    return {
      kind: "error" as const,
      message: "Your cart could not be found. Please refresh and try again.",
    };
  try {
    const { cart } = await sdk.store.cart.updateLineItem(id, lineId, {
      quantity,
    });
    return await withVariantCounts(cart);
  } catch {
    return {
      kind: "error" as const,
      message:
        "Couldn’t update this item. Please check availability and try again.",
    };
  }
}

export async function removeCartItem(lineId: string) {
  if (!lineId)
    return { kind: "error" as const, message: "This item could not be found." };
  const id = (await cookies()).get(CART_COOKIE)?.value;
  if (!id)
    return {
      kind: "error" as const,
      message: "Your cart could not be found. Please refresh and try again.",
    };
  try {
    const { parent } = await sdk.store.cart.deleteLineItem(id, lineId);
    if (!parent) return await readCart();
    return await withVariantCounts(parent);
  } catch {
    return {
      kind: "error" as const,
      message: "Couldn’t remove this item. Please try again.",
    };
  }
}
