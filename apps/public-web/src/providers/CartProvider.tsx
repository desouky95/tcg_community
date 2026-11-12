"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { HttpTypes } from "@medusajs/types";
import { Dialog } from "@tcg/ui-web/components/radix/dialog";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import {
  addCartItem,
  readCart,
  updateCartItem,
  removeCartItem,
} from "../lib/cart-actions";

type CartContextValue = {
  add: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => Promise<string | undefined>;
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
  const [cart, setCart] = useState<HttpTypes.StoreCart>();
  const [variantCounts, setVariantCounts] = useState<Record<string, number>>(
    {},
  );
  const [mutationError, setMutationError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const pendingRef = useRef(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const revision = useRef(0);
  const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const refresh = useCallback(async () => {
    const current = ++revision.current;
    setLoading(true);
    try {
      const result = await readCart();
      if (current !== revision.current) return;
      if (result.kind === "ready") {
        setCart(result.cart);
        setVariantCounts(result.variantCounts ?? {});
        setError("");
      } else if (result.kind === "empty") {
        setCart(undefined);
        setError("");
      } else setError("Your cart is temporarily unavailable.");
    } catch {
      if (current === revision.current)
        setError("Your cart is temporarily unavailable.");
    } finally {
      if (current === revision.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
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
    setPending(true);
    revision.current++;
    setLoading(false);
    try {
      const result = await addCartItem(productId, variantId, quantity);
      if (result.kind === "error") return result.message;
      setCart(result.cart);
      setVariantCounts(result.variantCounts ?? {});
      setMutationError("");
      setError("");
      setOpen(true);
      return undefined;
    } catch {
      return "We couldn’t add this item. Please try again.";
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };
  const changeItem = async (lineId: string, quantity?: number) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setMutationError("");
    revision.current++;
    setLoading(false);
    try {
      const result =
        quantity === undefined
          ? await removeCartItem(lineId)
          : await updateCartItem(lineId, quantity);
      if (result.kind === "error") setMutationError(result.message);
      else if (result.kind === "ready") {
        setCart(result.cart);
        setVariantCounts(result.variantCounts ?? {});
      } else
        setMutationError("Your cart could not be refreshed. Please try again.");
    } catch {
      setMutationError("Couldn’t update your cart. Please try again.");
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };
  const openCart = () => {
    returnFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setOpen(true);
    if (!pendingRef.current) void refresh();
  };
  return (
    <CartContext.Provider value={{ add, openCart, count, pending }}>
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
                  onClick={() => void refresh()}
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
            <button
              type="button"
              disabled
              aria-describedby="checkout-unavailable"
              className="min-h-12 w-full rounded-md border border-wax-line px-4 font-semibold opacity-50"
            >
              Proceed to checkout
            </button>
            <p
              id="checkout-unavailable"
              className="mt-3 text-center text-sm text-wax-muted"
            >
              Checkout coming soon.
            </p>
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
        className="absolute -end-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-signature-lime-500 px-1 text-xs font-bold text-primary-500"
      >
        {count}
      </span>
    </button>
  );
}
