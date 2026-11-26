import "server-only";
import type { HttpTypes } from "@medusajs/types";
import { sdk } from "../clients/medusa";

type CartWithCustomer = HttpTypes.StoreCart & {
  customer?: {
    has_account?: boolean;
    metadata?: { next_pull_user_id?: string } | null;
  } | null;
};

// Keep the expanded customer on the server. Checkout only needs it for ownership checks.
export async function retrieveCartWithCustomer(
  id: string,
  fields = "*customer",
) {
  const { cart }: { cart: CartWithCustomer } = await sdk.store.cart.retrieve(id, {
    fields,
  });
  return cart;
}
