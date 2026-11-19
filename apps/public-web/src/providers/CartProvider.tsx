"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Dialog } from "@tcg/ui-web/components/radix/dialog";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import {
  addCartItem,
  addCartItems,
  readCart,
  updateCartItem,
  removeCartItem,
} from "../lib/commerce/cart-actions";

const CART_QUERY_KEY = ["store-cart"] as const;

type CartContextValue = {
  add: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => Promise<string | undefined>;
  addMany: (
    productId: string,
    items: { variantId: string; quantity: number }[],
  ) => Promise<{ addedVariantIds: string[]; failures: { variantId: string; message: string }[] }>;
  openCart: () => void;
  count: number;
  pending: boolean;
};
const CartContext = createContext<CartContextValue | null>(null);
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("CartProvider missing");
  return value;
}
function money(amount: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(
    amount,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => {
      const result = await readCart();
      if (result.kind === "unavailable") throw new Error("Cart unavailable");
      return result;
    },
  });
  const cart = cartQuery.data?.kind === "ready" ? cartQuery.data.cart : undefined;
  const variantCounts =
    cartQuery.data?.kind === "ready" ? cartQuery.data.variantCounts ?? {} : {};
  const mutation = useMutation({
    mutationFn: async (
      input:
        | { kind: "add"; productId: string; variantId: string; quantity: number }
        | { kind: "addMany"; productId: string; items: { variantId: string; quantity: number }[] }
        | { kind: "update"; lineId: string; quantity: number }
        | { kind: "remove"; lineId: string },
    ) => {
      if (input.kind === "add")
        return addCartItem(input.productId, input.variantId, input.quantity);
      if (input.kind === "addMany")
        return addCartItems(input.productId, input.items);
      if (input.kind === "update")
        return updateCartItem(input.lineId, input.quantity);
      return removeCartItem(input.lineId);
    },
    onMutate: () => queryClient.cancelQueries({ queryKey: CART_QUERY_KEY }),
    onSuccess: (result) => {
      if (result.kind === "ready" || result.kind === "empty")
        queryClient.setQueryData(CART_QUERY_KEY, result);
      if (result.kind === "batch" && result.cartState)
        queryClient.setQueryData(CART_QUERY_KEY, result.cartState);
    },
    onSettled: (result) => {
      if (!result || result.kind === "error" || (result.kind === "batch" && !result.cartState))
        void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
  const [mutationError, setMutationError] = useState("");
  const [open, setOpen] = useState(false);
  const loading = cartQuery.isLoading || cartQuery.isFetching;
  const pending = mutation.isPending;
  const error = cartQuery.isError ? "Your cart is temporarily unavailable." : "";
  const pendingRef = useRef(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const add = async (
    productId: string,
    variantId: string,
    quantity: number,
  ) => {
    if (pendingRef.current) return "Please wait for the current request.";
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    pendingRef.current = true;
    try {
      const result = await mutation.mutateAsync({
        kind: "add",
        productId,
        variantId,
        quantity,
      });
      if (result.kind === "error") return result.message;
      setMutationError("");
      setOpen(true);
      return undefined;
    } catch {
      return "We couldn’t add this item. Please try again.";
    } finally {
      pendingRef.current = false;
    }
  };
  const addMany = async (productId: string, items: { variantId: string; quantity: number }[]) => {
    if (pendingRef.current) {
      return {
        addedVariantIds: [],
        failures: items.map((item) => ({ variantId: item.variantId, message: "Please wait for the current request." })),
      };
    }
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    pendingRef.current = true;
    try {
      const result = await mutation.mutateAsync({ kind: "addMany", productId, items });
      if (result.kind === "batch" && result.addedVariantIds.length) {
        setMutationError("");
        setOpen(true);
      }
      return result.kind === "batch"
        ? { addedVariantIds: result.addedVariantIds, failures: result.failures }
        : { addedVariantIds: [], failures: items.map((item) => ({ variantId: item.variantId, message: "We couldn’t add this card. Please try again." })) };
    } catch {
      return {
        addedVariantIds: [],
        failures: items.map((item) => ({ variantId: item.variantId, message: "We couldn’t add this card. Please try again." })),
      };
    } finally {
      pendingRef.current = false;
    }
  };
  const changeItem = async (lineId: string, quantity?: number) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setMutationError("");
    try {
      const result = await mutation.mutateAsync(
        quantity === undefined
          ? { kind: "remove", lineId }
          : { kind: "update", lineId, quantity },
      );
      if (result.kind === "error") setMutationError(result.message);
      else if (result.kind !== "ready" && result.kind !== "empty")
        setMutationError("Your cart could not be refreshed. Please try again.");
    } catch {
      setMutationError("Couldn’t update your cart. Please try again.");
    } finally {
      pendingRef.current = false;
    }
  };
  const openCart = () => {
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setOpen(true);
    if (!pendingRef.current) void cartQuery.refetch();
  };
  return (
    <CartContext.Provider value={{ add, addMany, openCart, count, pending }}>
      {children}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content
          placement="end"
          className="p-0"
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            if (returnFocus.current?.isConnected) {
              event.preventDefault();
              returnFocus.current.focus();
            }
          }}
        >
          <div className="flex items-center justify-between border-b border-wax-line p-6">
            <Dialog.Title>Your cart</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close cart"
                className="focus-ring grid size-11 place-items-center"
              >
                <X aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <p role="status">Loading your cart…</p>
            ) : error ? (
              <div role="alert">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void cartQuery.refetch()}
                  className="focus-ring mt-3 underline"
                >
                  Try again
                </button>
              </div>
            ) : !cart?.items?.length ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="space-y-5">
                {cart.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 border-b border-wax-line pb-5"
                  >
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="size-20 shrink-0 rounded-md bg-paper-200 object-contain"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-semibold">
                        {item.product_title || item.title}
                      </p>
                      {item.variant_title &&
                        (!item.product_id ||
                          variantCounts[item.product_id] !== 1) && (
                          <p className="mt-1 text-sm text-wax-muted">
                            {item.variant_title}
                          </p>
                        )}
                      <div className="mt-3 flex flex-wrap items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.product_title || item.title}`}
                          className="focus-ring grid size-11 place-items-center rounded-md border border-wax-line disabled:opacity-50"
                          disabled={pending || item.quantity <= 1}
                          onClick={() =>
                            void changeItem(item.id, item.quantity - 1)
                          }
                        >
                          <Minus aria-hidden="true" className="size-4" />
                        </button>
                        <span
                          className="min-w-8 text-center tabular-nums"
                          aria-label={`Quantity: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.product_title || item.title}`}
                          className="focus-ring grid size-11 place-items-center rounded-md border border-wax-line disabled:opacity-50"
                          disabled={pending || item.quantity >= 99}
                          onClick={() =>
                            void changeItem(item.id, item.quantity + 1)
                          }
                        >
                          <Plus aria-hidden="true" className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${item.product_title || item.title} from cart`}
                          className="focus-ring grid size-11 place-items-center rounded-md disabled:opacity-50"
                          disabled={pending}
                          onClick={() => void changeItem(item.id)}
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                    </div>
                    {item.total != null && cart.currency_code && (
                      <span className="text-sm font-semibold">
                        {money(item.total, cart.currency_code)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {mutationError && (
            <p role="alert" className="px-6 pb-3 text-sm text-danger-600">
              {mutationError}
            </p>
          )}
          <div
            className="border-t border-wax-line p-6"
            style={{
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
            }}
          >
            {!loading &&
            !error &&
            cart?.items?.length &&
            cart.subtotal != null &&
            cart.currency_code ? (
              <p className="mb-5 flex justify-between font-display font-semibold">
                <span>Subtotal</span>
                <span>{money(cart.subtotal, cart.currency_code)}</span>
              </p>
            ) : null}
            {!loading && !error && !!cart?.items?.length && (
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="focus-ring flex min-h-12 w-full items-center justify-center rounded-md bg-primary-500 px-4 font-semibold text-white"
              >
                Proceed to checkout
              </Link>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </CartContext.Provider>
  );
}
export function CartButton() {
  const { openCart, count } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className="focus-ring relative grid size-11 place-items-center rounded-md text-primary-500"
      aria-label="Open cart"
    >
      <ShoppingBag aria-hidden="true" className="size-5" />
      <span
        aria-live="polite"
        aria-atomic="true"
        className="absolute -inset-e-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-signature-lime-500 px-1 text-xs font-bold text-primary-500"
      >
        {count}
      </span>
    </button>
  );
}
