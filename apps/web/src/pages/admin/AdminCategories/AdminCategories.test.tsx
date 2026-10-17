import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminCategories from "./AdminCategories";
import { useCategories } from "@tcg/react-query";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tcg/react-query", () => ({
  useCategories: vi.fn(),
}));

const mockedUseCategories = vi.mocked(useCategories);

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/admin/categories"]}>
      <Routes>
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/categories/new" element={<p>Create category</p>} />
        <Route path="/admin/categories/:id/edit" element={<p>Edit category</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminCategories", () => {
  beforeEach(() => {
    mockedUseCategories.mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useCategories>);
  });

  it("routes the main CTA to category creation", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("link", { name: /admin.categories.new_cat/ }));
    expect(screen.getByText("Create category")).toBeInTheDocument();
  });

  it("expands a parent without navigating and opens a child edit page", async () => {
    const user = userEvent.setup();
    mockedUseCategories.mockReturnValue({
      data: [
        {
          id: "1",
          name: "Football",
          parentId: -1,
          children: [
            { id: "2", name: "Premier League", parentId: 1, children: [] },
          ],
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useCategories>);
    renderPage();

    const expandButton = screen.getByRole("button", { name: /admin.categories.expand/ });
    await user.click(expandButton);
    expect(expandButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /Premier League/ })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /Premier League/ }));
    expect(screen.getByText("Edit category")).toBeInTheDocument();
  });
});
