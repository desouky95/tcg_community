import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SharedCollection from "./SharedCollection";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("../lib/api", () => ({ api: { http: { get } } }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string, options?: { count?: number }) => options?.count ? `${options.count} copies` : key }) }));

describe("SharedCollection", () => {
  it("renders missing and duplicates in the order supplied by the API", async () => {
    get.mockResolvedValue({ data: { data: { checklistName: "Set", username: "collector", missing: [{ id: 1, number: "20", name: "First" }, { id: 2, number: "3", name: "Second" }], duplicates: [{ id: 2, number: "3", name: "Second", quantity: 2 }] } } });
    render(<MemoryRouter initialEntries={["/shared/collection/token"]}><Routes><Route path="/shared/collection/:token" element={<SharedCollection />} /></Routes></MemoryRouter>);
    expect(await screen.findByText("Set")).toBeInTheDocument();
    const lists = screen.getAllByRole("list");
    expect(within(lists[0]).getAllByRole("listitem").map((item) => item.textContent)).toEqual(["20 — First", "3 — Second"]);
    expect(within(lists[1]).getByText(/2 copies/)).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith("/shared/collections/token");
  });
});
