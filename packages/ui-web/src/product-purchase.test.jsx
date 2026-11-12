import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PurchasePanel } from "../../../apps/public-web/app/(shared-layout)/(store)/shop/[handle]/_components/purchase-panel";
const state = vi.hoisted(() => ({ add: vi.fn(), pending: false }));
vi.mock("../../../apps/public-web/src/providers/CartProvider", () => ({ useCart: () => state }));
const variants = [{ id: "v1", title: "Box", manage_inventory: true, allow_backorder: false, inventory_quantity: 2, calculated_price: { calculated_amount: 20, currency_code: "egp" } }, { id: "v2", title: "Pack", manage_inventory: true, allow_backorder: false, inventory_quantity: 0, calculated_price: { calculated_amount: 10, currency_code: "egp" } }];
describe("product purchase", () => {
  it("updates price and availability when changing variants", async () => {
    const user = userEvent.setup(); render(<PurchasePanel productId="p" variants={variants} regionId="reg_1" />);
    expect(screen.getByText(/20\.00/)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Variant"), "v2");
    expect(screen.getByText(/10\.00/)).toBeInTheDocument();
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  });
  it("submits selected quantity and shows an error when adding fails", async () => {
    state.add.mockResolvedValueOnce("Stock changed"); const user = userEvent.setup();
    render(<PurchasePanel productId="p" variants={variants} regionId="reg_1" />);
    const quantity = screen.getByLabelText("Quantity"); await user.clear(quantity); await user.type(quantity, "2");
    await user.click(screen.getByRole("button", { name: "Add to cart" }));
    expect(state.add).toHaveBeenCalledWith("p", "v1", 2); expect(screen.getByRole("alert")).toHaveTextContent("Stock changed");
  });
  it("prevents purchasing without a region price", () => {
    render(<PurchasePanel productId="p" variants={variants} />);
    expect(screen.getByText("Price unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeDisabled();
  });
  it("steps within inventory limits and resets on variant changes", async () => {
    const user = userEvent.setup(); render(<PurchasePanel productId="p" variants={variants} regionId="reg_1" />);
    const quantity = screen.getByLabelText("Quantity");
    const decrease = screen.getByRole("button", { name: "Decrease quantity" });
    const increase = screen.getByRole("button", { name: "Increase quantity" });
    expect(decrease).toBeDisabled();
    await user.click(increase);
    expect(quantity).toHaveValue(2);
    expect(increase).toBeDisabled();
    await user.click(decrease);
    expect(quantity).toHaveValue(1);
    await user.click(increase);
    await user.selectOptions(screen.getByLabelText("Variant"), "v2");
    expect(quantity).toHaveValue(1);
    expect(increase).toBeDisabled();
    expect(decrease).toBeDisabled();
  });
  it("rejects empty, fractional, and excessive quantities", async () => {
    const user = userEvent.setup(); render(<PurchasePanel productId="p" variants={variants} regionId="reg_1" />);
    const quantity = screen.getByLabelText("Quantity");
    const submit = screen.getByRole("button", { name: "Add to cart" });
    await user.clear(quantity);
    expect(submit).toBeDisabled();
    await user.type(quantity, "1.5");
    expect(submit).toBeDisabled();
    await user.clear(quantity);
    await user.type(quantity, "3");
    expect(submit).toBeDisabled();
  });
});
