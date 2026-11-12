import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ description: "" }));
vi.mock("next/link", () => ({ default: ({ children, ...props }) => <a {...props}>{children}</a> }));
vi.mock("next/navigation", () => ({ notFound: vi.fn() }));
vi.mock("../../../apps/public-web/src/lib/product-detail.server", () => ({
  getProductDetail: async () => ({ kind: "ready", product: { id: "p1", title: "Box", description: state.description, images: [], variants: [] } }),
}));
vi.mock("../../../apps/public-web/app/(shared-layout)/(store)/shop/commerce-customer-link", () => ({ CommerceCustomerLink: () => null }));
vi.mock("../../../apps/public-web/app/(shared-layout)/(store)/shop/[handle]/_components/product-gallery", () => ({ ProductGallery: () => null }));
vi.mock("../../../apps/public-web/app/(shared-layout)/(store)/shop/[handle]/_components/purchase-panel", () => ({ PurchasePanel: () => <button>Add to cart</button> }));

import ProductPage from "../../../apps/public-web/app/(shared-layout)/(store)/shop/[handle]/page";

async function renderPage(description) {
  state.description = description;
  render(await ProductPage({ params: Promise.resolve({ handle: "box" }), searchParams: Promise.resolve({}) }));
}

describe("product description", () => {
  it("shows multiline text after the purchase controls", async () => {
    await renderPage("  First line\n\nSecond line  ");
    const description = screen.getByRole("region", { name: "Description" });
    expect(description.querySelector("p")).toHaveTextContent("First line Second line");
    expect(description.querySelector("p").textContent).toBe("First line\n\nSecond line");
    expect(screen.getByRole("button", { name: "Add to cart" }).compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it.each([null, "", "  \n  "])("omits the section for an empty description (%s)", async (description) => {
    await renderPage(description);
    expect(screen.queryByRole("region", { name: "Description" })).not.toBeInTheDocument();
  });
});
