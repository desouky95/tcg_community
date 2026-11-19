"use server";

import { cookies } from "next/headers";
import { checkoutReview } from "./checkout-review";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "../clients/medusa";

const COOKIE = "next_pull_cart";
const MANUAL = "pp_system_default";
const INSTAPAY = "pp_instapay_offline";
const COD = "pp_cod_offline";

type InstapaySettings = { instapay_url: string; whatsapp_number: string };

async function instapaySettings(regionId: string) {
  try {
    const result = await sdk.client.fetch<{ instapay: InstapaySettings | null }>(
      `/store/payment-instructions?region_id=${encodeURIComponent(regionId)}`,
    );
    return result.instapay;
  } catch {
    return null;
  }
}

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

export async function saveContact(input: unknown) {
  const id = await cartId();
  const email = typeof input === "string" ? input.trim() : "";
  if (!id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { kind: "error" as const, message: "Enter a valid email address." };
  try {
    const { cart } = await sdk.store.cart.update(id, { email });
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

function isCheckoutAddress(value: unknown): value is CheckoutAddress {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    [
      "first_name",
      "last_name",
      "address_1",
      "address_2",
      "city",
      "province",
      "postal_code",
      "country_code",
      "phone",
    ].every((key) => typeof (value as Record<string, unknown>)[key] === "string")
  );
}

export async function saveAddress(input: unknown) {
  const id = await cartId();
  if (!id || !isCheckoutAddress(input))
    return {
      kind: "error" as const,
      message:
        "Complete your name, address, city, and two-letter country code.",
    };
  const address = input;
  if (
    !address.first_name.trim() ||
    !address.last_name.trim() ||
    !address.address_1.trim() ||
    !address.city.trim() ||
    !/^[a-z]{2}$/i.test(address.country_code.trim())
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
    const eligibleForOffline =
      cart.currency_code === "egp" &&
      cart.shipping_address?.country_code?.toLowerCase() === "eg";
    const regionProviders = payment_providers.filter(
      (provider) => provider.id === MANUAL,
    );
    const settings = eligibleForOffline
      ? await instapaySettings(cart.region_id)
      : null;
    if (eligibleForOffline) {
      regionProviders.push(
        ...payment_providers.filter(
          (provider) =>
            provider.id === COD || (provider.id === INSTAPAY && settings),
        ),
      );
    }
    return {
      kind: "ready" as const,
      cart,
      providers: regionProviders,
      instapay: settings,
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
  if (!id || ![MANUAL, INSTAPAY, COD].includes(providerId))
    return {
      kind: "error" as const,
      message: "Choose an available payment method.",
    };
  try {
    const { cart } = await sdk.store.cart.retrieve(id);
    if (!cart.region_id) throw new Error("Missing region");
    const isOffline = providerId === INSTAPAY || providerId === COD;
    const isEgyptEgp =
      cart.currency_code === "egp" &&
      cart.shipping_address?.country_code?.toLowerCase() === "eg";
    const settings = providerId === INSTAPAY
      ? await instapaySettings(cart.region_id)
      : null;
    if (isOffline && !isEgyptEgp) throw new Error("Unavailable provider");
    if (providerId === INSTAPAY && !settings)
      throw new Error("InstaPay settings unavailable");
    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: cart.region_id,
    });
    if (!payment_providers.some((provider) => provider.id === providerId))
      throw new Error("Unavailable provider");
    await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: providerId,
    });
    const updated = await sdk.store.cart.retrieve(id);
    return {
      kind: "ready" as const,
      cart: updated.cart,
      instapay: settings,
    };
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
  } catch(error) {
    console.log({error})
    return {
      kind: "uncertain" as const,
      message:
        "We couldn’t confirm whether your order was placed. Check your orders or contact support before trying again.",
    };
  }
}
