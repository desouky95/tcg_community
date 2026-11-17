import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mock = vi.hoisted(() => ({
  checkoutCart: vi.fn(),
  saveContact: vi.fn(),
  saveAddress: vi.fn(),
  selectShipping: vi.fn(),
  selectPayment: vi.fn(),
  placeOrder: vi.fn(),
  profile: vi.fn(),
  addresses: vi.fn(),
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }) => <a {...props}>{children}</a>,
}));
vi.mock("../../../apps/public-web/src/lib/checkout-actions", () => mock);
vi.mock("../../../apps/public-web/src/lib/api", () => ({
  api: { getProfile: mock.profile, http: { get: mock.addresses } },
}));
import { Checkout } from "../../../apps/public-web/app/(shared-layout)/checkout/checkout";

const cart = {
  id: "cart_1",
  region_id: "region",
  currency_code: "egp",
  total: 100,
  subtotal: 100,
  items: [{ id: "item", title: "Box", quantity: 1, total: 100 }],
};
const address = {
  id: "a1",
  first_name: "Alex",
  last_name: "Rivera",
  address_1: "Street 1",
  address_2: "",
  city: "Cairo",
  province: "",
  postal_code: "",
  country_code: "eg",
  phone: "",
};
const ready = { kind: "ready", cart };
beforeEach(() => {
  vi.resetAllMocks();
  mock.checkoutCart.mockResolvedValue(ready);
  mock.profile.mockRejectedValue(new Error("guest"));
  mock.addresses.mockRejectedValue(new Error("guest"));
  mock.saveContact.mockResolvedValue(ready);
  mock.saveAddress.mockResolvedValue({
    ...ready,
    options: [{ id: "ship", name: "Standard", amount: 10 }],
  });
  mock.selectShipping.mockResolvedValue({
    ...ready,
    providers: [{ id: "pp_system_default" }],
  });
  mock.selectPayment.mockResolvedValue(ready);
  mock.placeOrder.mockResolvedValue({ kind: "order", displayId: 42 });
});
async function contact(user) {
  await screen.findByRole("heading", { name: "Contact details" });
  await user.type(
    screen.getByLabelText("Email address"),
    "shopper@example.com",
  );
  await user.click(
    screen.getByRole("button", { name: "Continue to delivery" }),
  );
  await screen.findByRole("heading", { name: "Delivery" });
}
async function fillAddress(user) {
  for (const [label, value] of [
    ["First name", "Alex"],
    ["Last name", "Rivera"],
    ["Address line 1", "Street 1"],
    ["City", "Cairo"],
    ["Country code (e.g. EG)", "EG"],
  ])
    await user.type(screen.getByLabelText(label), value);
}
async function payment(user) {
  await user.click(
    screen.getByRole("button", { name: "Find delivery methods" }),
  );
  await user.click(await screen.findByRole("radio", { name: /Standard/ }));
  await user.click(screen.getByRole("button", { name: "Continue to payment" }));
  await user.click(
    await screen.findByRole("radio", { name: /Manual payment/ }),
  );
  await user.click(screen.getByRole("button", { name: "Review order" }));
  await screen.findByRole("heading", { name: "Review your order" });
}
describe("checkout form", () => {
  it("validates the active fields and retains values when navigating back", async () => {
    const user = userEvent.setup();
    render(<Checkout />);
    await screen.findByRole("heading", { name: "Contact details" });
    await user.click(
      screen.getByRole("button", { name: "Continue to delivery" }),
    );
    expect(
      await screen.findByText("Enter your email address."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Email address")).toHaveFocus();
    await user.type(
      screen.getByLabelText("Email address"),
      "shopper@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: "Continue to delivery" }),
    );
    await user.click(
      await screen.findByRole("button", { name: "Find delivery methods" }),
    );
    expect(await screen.findByText("Enter first name.")).toBeInTheDocument();
    expect(screen.getByLabelText("First name")).toHaveAttribute(
      "aria-describedby",
      "first_name-error",
    );
    await user.click(screen.getByRole("button", { name: "Back to Contact" }));
    expect(screen.getByLabelText("Email address")).toHaveValue(
      "shopper@example.com",
    );
  });
  it("does not overwrite a typed email when account data arrives late", async () => {
    let resolveProfile;
    mock.profile.mockReturnValue(
      new Promise((resolve) => {
        resolveProfile = resolve;
      }),
    );
    const user = userEvent.setup();
    render(<Checkout />);
    const input = await screen.findByLabelText("Email address");
    await user.type(input, "typed@example.com");
    resolveProfile({ data: { data: { email: "account@example.com" } } });
    await waitFor(() => expect(input).toHaveValue("typed@example.com"));
  });
  it("applies saved addresses and clears stale delivery options on edit", async () => {
    mock.addresses.mockResolvedValue({ data: { addresses: [address] } });
    const user = userEvent.setup();
    render(<Checkout />);
    await contact(user);
    await user.selectOptions(
      await screen.findByLabelText("Use a saved address"),
      "a1",
    );
    expect(screen.getByLabelText("City")).toHaveValue("Cairo");
    await user.click(
      screen.getByRole("button", { name: "Find delivery methods" }),
    );
    await user.click(await screen.findByRole("radio", { name: /Standard/ }));
    await user.type(screen.getByLabelText("City"), "x");
    expect(
      screen.queryByRole("radio", { name: /Standard/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Find delivery methods" }),
    ).toBeInTheDocument();
  });
  it("shows failed submissions and completes a successful order once", async () => {
    mock.saveContact.mockResolvedValueOnce({
      kind: "error",
      message: "Try contact again.",
    });
    let resolveOrder;
    mock.placeOrder.mockReturnValue(
      new Promise((resolve) => {
        resolveOrder = resolve;
      }),
    );
    const user = userEvent.setup();
    render(<Checkout />);
    await screen.findByLabelText("Email address");
    await user.type(
      screen.getByLabelText("Email address"),
      "shopper@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: "Continue to delivery" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Try contact again.",
    );
    await user.click(
      screen.getByRole("button", { name: "Continue to delivery" }),
    );
    await screen.findByRole("heading", { name: "Delivery" });
    await fillAddress(user);
    await payment(user);
    await user.click(screen.getByRole("button", { name: "Place order" }));
    expect(screen.getByRole("button", { name: "Place order" })).toBeDisabled();
    expect(mock.placeOrder).toHaveBeenCalledTimes(1);
    resolveOrder({ kind: "order", displayId: 42 });
    expect(
      await screen.findByRole("heading", { name: "Thank you for your order" }),
    ).toBeInTheDocument();
  });
  it("returns to contact when the cart changes before confirmation", async () => {
    mock.placeOrder.mockResolvedValue({
      kind: "changed",
      cart: { ...cart, total: 110 },
    });
    const user = userEvent.setup();
    render(<Checkout />);
    await contact(user);
    await fillAddress(user);
    await payment(user);
    await user.click(screen.getByRole("button", { name: "Place order" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Your cart changed",
    );
    expect(
      screen.getByRole("heading", { name: "Contact details" }),
    ).toBeInTheDocument();
  });
  it("locks order submission after an uncertain completion", async () => {
    mock.placeOrder.mockResolvedValue({
      kind: "uncertain",
      message: "Check your orders before trying again.",
    });
    const user = userEvent.setup();
    render(<Checkout />);
    await contact(user);
    await fillAddress(user);
    await payment(user);
    await user.click(screen.getByRole("button", { name: "Place order" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Check your orders before trying again.",
    );
    expect(screen.getByRole("button", { name: "Place order" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Back to Payment" }),
    ).toBeDisabled();
    expect(mock.placeOrder).toHaveBeenCalledTimes(1);
  });
  it("requires a delivery choice and allows returning when payment is unavailable", async () => {
    mock.selectShipping.mockResolvedValue({ ...ready, providers: [] });
    const user = userEvent.setup();
    render(<Checkout />);
    await contact(user);
    await fillAddress(user);
    await user.click(
      screen.getByRole("button", { name: "Find delivery methods" }),
    );
    await screen.findByRole("radio", { name: /Standard/ });
    await user.click(
      screen.getByRole("button", { name: "Continue to payment" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Choose a delivery method.",
    );
    expect(screen.getByRole("radio", { name: /Standard/ })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await user.click(screen.getByRole("radio", { name: /Standard/ }));
    await user.click(
      screen.getByRole("button", { name: "Continue to payment" }),
    );
    expect(
      await screen.findByText(/No supported payment methods/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to Delivery" }),
    ).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Back to Delivery" }));
    expect(screen.getByLabelText("City")).toHaveValue("Cairo");
  });
});
