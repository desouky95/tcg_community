import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./components/patterns/product-card";

describe("ProductCard", () => {
  it("renders product details as a keyboard-focusable link", async () => {
    render(<ProductCard href="/shop/123" title="Collector box" image="/box.jpg" price="EGP 100" soldOut imageLoading="eager" />);
    const link = screen.getByRole("link", { name: /collector box/i });
    expect(link).toHaveAttribute("href", "/shop/123");
    expect(link).toHaveClass("focus-ring");
    expect(screen.getByText("EGP 100")).toBeInTheDocument();
    expect(screen.getByText("Sold out")).toBeInTheDocument();
    expect(link.querySelector("img")).toHaveAttribute("loading", "eager");
    await userEvent.tab();
    expect(link).toHaveFocus();
  });
  it("shows a fallback for missing artwork and omits unavailable information", () => {
    render(<ProductCard href="/shop/1" title="A very long product name" />);
    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
    expect(screen.queryByText("Sold out")).not.toBeInTheDocument();
  });
});
