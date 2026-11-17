"use server";

import { cookies } from "next/headers";
import { sdk } from "./sdk";
import { checkoutReview } from "./checkout-review";
import type { HttpTypes } from "@medusajs/types";

const COOKIE = "next_pull_cart";
const MANUAL = "pp_system_default";

async function cartId() {
  return (await cookies()).get(COOKIE)?.value;
}

export async function checkoutCart() {
  const id = await cartId();
  if (!id) return { kind: "empty" as const };
  try {
    const { cart } = await sdk.store.cart.retrieve(id);
    if (cart.completed_at) return { kind: "completed" as const };
    if (!cart.items?.length) return { kind: "empty" as const };
    return { kind: "ready" as const, cart };
  } catch {
    return {
      kind: "error" as const,
      message: "Your cart is temporarily unavailable. Please try again.",
    };
  }
}

export async function saveContact(email: string) {
  const id = await cartId();
  if (!id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return { kind: "error" as const, message: "Enter a valid email address." };
  try {
    const { cart } = await sdk.store.cart.update(id, { email: email.trim() });
    return { kind: "ready" as const, cart };
  } catch {
    return {
      kind: "error" as const,
      message: "We couldn’t save your contact details. Please try again.",
    };
  }
}

export type CheckoutAddress = {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone: string;
};

export async function saveAddress(address: CheckoutAddress) {
  const id = await cartId();
  if (
    !id ||
    !address.first_name?.trim() ||
    !address.last_name?.trim() ||
    !address.address_1?.trim() ||
    !address.city?.trim() ||
    !/^[a-z]{2}$/i.test(address.country_code?.trim() ?? "")
  )
    return {
      kind: "error" as const,
      message:
        "Complete your name, address, city, and two-letter country code.",
    };
  try {
    const normalized = {
      ...address,
      country_code: address.country_code.trim().toLowerCase(),
    };
    const { cart } = await sdk.store.cart.update(id, {
      shipping_address: normalized,
      billing_address: normalized,
    });
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
      cart_id: id,
    });
    const options = await Promise.all(
      shipping_options.map(async (option) => {
        if (option.price_type !== "calculated") return option;
        try {
          return (
            await sdk.store.fulfillment.calculate(option.id, { cart_id: id })
          ).shipping_option;
        } catch {
          return null;
        }
      }),
    );
    return {
      kind: "ready" as const,
      cart,
      options: options.filter(
        (option): option is HttpTypes.StoreCartShippingOption =>
          option !== null,
      ),
    };
  } catch {
    return {
      kind: "error" as const,
      message:
        "We couldn’t find delivery options for this address. Check your details and try again.",
    };
  }
}

export async function selectShipping(optionId: string) {
  const id = await cartId();
  if (!id || !optionId)
    return { kind: "error" as const, message: "Choose a delivery method." };
  try {
    const { cart } = await sdk.store.cart.addShippingMethod(id, {
      option_id: optionId,
    });
    if (!cart.region_id) throw new Error("Missing region");
    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: cart.region_id,
    });
    return {
      kind: "ready" as const,
      cart,
      providers: payment_providers.filter((provider) => provider.id === MANUAL),
    };
  } catch {
    return {
      kind: "error" as const,
      message: "This delivery method is unavailable. Please try again.",
    };
  }
}

export async function selectPayment(providerId: string) {
  const id = await cartId();
  if (!id || providerId !== MANUAL)
    return {
      kind: "error" as const,
      message: "Choose an available payment method.",
    };
  try {
    const { cart } = await sdk.store.cart.retrieve(id);
    if (!cart.region_id) throw new Error("Missing region");
    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: cart.region_id,
    });
    if (!payment_providers.some((provider) => provider.id === providerId))
      throw new Error("Unavailable provider");
    await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: providerId,
    });
    const updated = await sdk.store.cart.retrieve(id);
    return { kind: "ready" as const, cart: updated.cart };
  } catch {
    return {
      kind: "error" as const,
      message: "We couldn’t prepare payment. Please try again.",
    };
  }
}

export async function placeOrder(
  expectedTotal: number,
  expectedCurrency: string,
  expectedReview: string,
) {
  const id = await cartId();
  if (!id || !Number.isFinite(expectedTotal) || !expectedCurrency)
    return {
      kind: "error" as const,
      message: "Your cart is unavailable. Return to the shop and try again.",
    };
  try {
    const { cart } = await sdk.store.cart.retrieve(id);
    if (
      cart.total !== expectedTotal ||
      cart.currency_code !== expectedCurrency ||
      checkoutReview(cart) !== expectedReview
    )
      return { kind: "changed" as const, cart };
    const result = await sdk.store.cart.complete(id);
    if (result.type === "cart")
      return {
        kind: "error" as const,
        message:
          "Your order could not be placed. Check your cart and try again.",
      };
    (await cookies()).delete(COOKIE);
    return { kind: "order" as const, displayId: result.order.display_id };
  } catch {
    return {
      kind: "uncertain" as const,
      message:
        "We couldn’t confirm whether your order was placed. Check your orders or contact support before trying again.",
    };
  }
}
