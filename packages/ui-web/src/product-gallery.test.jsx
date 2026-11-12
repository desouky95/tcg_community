import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
const carousel = vi.hoisted(() => {
  let selected = 0;
  const listeners = new Set();
  const api = {
    selectedScrollSnap: () => selected,
    scrollTo: (index) => { selected = index; listeners.forEach((listener) => listener()); },
    on: (_event, listener) => { listeners.add(listener); return api; },
    off: (_event, listener) => { listeners.delete(listener); return api; },
  };
  return { api, reset: () => { selected = 0; listeners.clear(); } };
});
vi.mock("embla-carousel-react", () => ({ default: () => [() => {}, carousel.api] }));
import { ProductGallery } from "../../../apps/public-web/app/(shared-layout)/(store)/shop/[handle]/_components/product-gallery";
describe("product gallery", () => {
  beforeEach(() => carousel.reset());
  it("switches images and recovers from a broken image", async () => {
    const user = userEvent.setup(); render(<ProductGallery title="Box" images={["/one.jpg", "/two.jpg"]} />);
    expect(screen.getByRole("img", { name: "Box" })).toHaveAttribute("src", "/one.jpg");
    await user.click(screen.getByRole("button", { name: "Show image 2 of 2" }));
    expect(screen.getByRole("img", { name: "Box" })).toHaveAttribute("src", "/two.jpg");
    fireEvent.error(screen.getByRole("img", { name: "Box" }));
    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
  });
  it("shows a fallback without images", () => { render(<ProductGallery title="Box" images={[]} />); expect(screen.getByText("Image unavailable")).toBeInTheDocument(); });
  it("updates the active thumbnail when the carousel selects an image", () => {
    render(<ProductGallery title="Box" images={["/one.jpg", "/two.jpg"]} />);
    act(() => carousel.api.scrollTo(1));
    expect(screen.getByRole("button", { name: "Show image 2 of 2" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img", { name: "Box" })).toHaveAttribute("src", "/two.jpg");
  });
  it("does not show thumbnail controls for a single image", () => {
    render(<ProductGallery title="Box" images={["/one.jpg"]} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
