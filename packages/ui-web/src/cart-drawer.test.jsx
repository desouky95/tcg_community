import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  CartProvider,
  CartButton,
  useCart,
} from "../../../apps/public-web/src/providers/CartProvider";
const actions = vi.hoisted(() => ({
  readCart: vi.fn(),
  addCartItem: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
}));
vi.mock("../../../apps/public-web/src/lib/cart-actions", () => actions);
const cart = {
  id: "cart_1",
  region_id: "reg_1",
  currency_code: "egp",
  subtotal: 20,
  items: [
    {
      id: "line_1",
      title: "Box",
      variant_title: "Hobby",
      quantity: 1,
      total: 20,
    },
  ],
};
function AddButton() {
  const { add } = useCart();
  return <button onClick={() => void add("p", "v", 1)}>Add item</button>;
}
describe("cart drawer", () => {
  it("opens on addition, restores focus and reopens from the header", async () => {
    actions.readCart.mockResolvedValue({ kind: "ready", cart });
    actions.addCartItem.mockResolvedValue({ kind: "ready", cart });
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartButton />
        <AddButton />
      </CartProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Add item" }));
    expect(
      await screen.findByRole("dialog", { name: "Your cart" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Hobby")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close cart" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: "Add item" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Open cart" }));
    expect(
      await screen.findByRole("dialog", { name: "Your cart" }),
    ).toBeInTheDocument();
  });

  it("updates quantities and removes items using returned cart state", async () => {
    const initial = {
      ...cart,
      items: [{ ...cart.items[0], product_id: "prod_1" }],
    };
    const updated = {
      ...initial,
      subtotal: 40,
      items: [{ ...initial.items[0], quantity: 2, total: 40 }],
    };
    actions.readCart.mockResolvedValue({
      kind: "ready",
      cart: initial,
      variantCounts: { prod_1: 2 },
    });
    actions.updateCartItem.mockResolvedValue({
      kind: "ready",
      cart: updated,
      variantCounts: { prod_1: 2 },
    });
    actions.removeCartItem.mockResolvedValue({
      kind: "ready",
      cart: { ...updated, items: [], subtotal: 0 },
      variantCounts: {},
    });
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartButton />
      </CartProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Open cart" }));
    expect(await screen.findByText("Hobby")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrease quantity of Box" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Proceed to checkout" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Increase quantity of Box" }),
    );
    expect(actions.updateCartItem).toHaveBeenCalledWith("line_1", 2);
    expect(await screen.findByLabelText("Quantity: 2")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Remove Box from cart" }),
    );
    expect(await screen.findByText("Your cart is empty.")).toBeInTheDocument();
  });
  it("hides a single variant and preserves cart on mutation error", async () => {
    const item = {
      ...cart,
      items: [{ ...cart.items[0], product_id: "prod_1" }],
    };
    actions.readCart.mockResolvedValue({
      kind: "ready",
      cart: item,
      variantCounts: { prod_1: 1 },
    });
    actions.updateCartItem.mockResolvedValue({
      kind: "error",
      message: "Please try again.",
    });
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartButton />
      </CartProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Open cart" }));
    expect(await screen.findByText("Box")).toBeInTheDocument();
    expect(screen.queryByText("Hobby")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Increase quantity of Box" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please try again.",
    );
    expect(screen.getByLabelText("Quantity: 1")).toBeInTheDocument();
  });
  it("disables cart controls during a pending update", async () => {
    actions.readCart.mockResolvedValue({ kind: "ready", cart });
    let resolve;
    actions.updateCartItem.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const user = userEvent.setup();
    render(
      <CartProvider>
        <CartButton />
      </CartProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Open cart" }));
    await screen.findByText("Box");
    await user.click(
      screen.getByRole("button", { name: "Increase quantity of Box" }),
    );
    expect(
      screen.getByRole("button", { name: "Increase quantity of Box" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Remove Box from cart" }),
    ).toBeDisabled();
    resolve({ kind: "ready", cart });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Increase quantity of Box" }),
      ).toBeEnabled(),
    );
  });
  it("prevents concurrent add requests", async () => {
    actions.readCart.mockResolvedValue({ kind: "empty" });
    let resolve;
    actions.addCartItem.mockImplementation(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const user = userEvent.setup();
    render(
      <CartProvider>
        <AddButton />
      </CartProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Add item" }));
    await user.click(screen.getByRole("button", { name: "Add item" }));
    expect(actions.addCartItem).toHaveBeenCalledTimes(1);
    resolve({ kind: "ready", cart });
    expect(
      await screen.findByRole("dialog", { name: "Your cart" }),
    ).toBeInTheDocument();
  });
});
