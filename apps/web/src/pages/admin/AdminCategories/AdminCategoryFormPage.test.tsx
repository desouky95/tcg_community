import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useCategories,
  useCategory,
  useCategoryMutations,
} from "../../../hooks/useCategories";
import AdminCategoryFormPage from "./AdminCategoryFormPage";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("../../../hooks/useCategories", () => ({
  useCategories: vi.fn(),
  useCategory: vi.fn(),
  useCategoryMutations: vi.fn(),
}));

const createCategory = vi.fn();
const updateCategory = vi.fn();
const addSubcategory = vi.fn();
const deleteCategory = vi.fn();
const parents = [{ id: "1", name: "Football", parentId: -1, children: [] }];

function renderPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/admin/categories/new"
          element={<AdminCategoryFormPage />}
        />
        <Route
          path="/admin/categories/:id/edit"
          element={<AdminCategoryFormPage />}
        />
        <Route path="/admin/categories" element={<p>Category table</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminCategoryFormPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCategories).mockReturnValue({
      data: parents,
      isLoading: false,
    } as never);
    vi.mocked(useCategory).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(useCategoryMutations).mockReturnValue({
      createCategory: { isPending: false, mutateAsync: createCategory },
      updateCategory: { isPending: false, mutateAsync: updateCategory },
      addSubcategory: { isPending: false, mutateAsync: addSubcategory },
      deleteCategory: { isPending: false, mutateAsync: deleteCategory },
    } as never);
  });

  it("creates a parent with its initial subcategories", async () => {
    const user = userEvent.setup();
    createCategory.mockResolvedValue({});
    renderPage("/admin/categories/new");
    await user.type(
      screen.getByLabelText("admin.categories.cat_name"),
      "Basketball",
    );
    await user.click(
      screen.getByRole("button", {
        name: "admin.categories.add_initial_subcategory",
      }),
    );
    await user.type(screen.getByLabelText("admin.categories.new_sub 1"), "NBA");
    await user.click(
      screen.getByRole("button", { name: "admin.categories.create" }),
    );
    await waitFor(() =>
      expect(createCategory).toHaveBeenCalledWith({
        name: "Basketball",
        subcategories: ["NBA"],
      }),
    );
    expect(screen.getByText("Category table")).toBeInTheDocument();
  });

  it("creates a subcategory under the selected parent", async () => {
    const user = userEvent.setup();
    createCategory.mockResolvedValue({});
    renderPage("/admin/categories/new");
    await user.click(
      screen.getByLabelText("admin.categories.creation_subcategory"),
    );
    await user.type(
      screen.getByLabelText("admin.categories.cat_name"),
      "Premier League",
    );
    await user.selectOptions(
      screen.getByLabelText("admin.categories.parent_selector"),
      "1",
    );
    await user.click(
      screen.getByRole("button", { name: "admin.categories.create" }),
    );
    await waitFor(() =>
      expect(createCategory).toHaveBeenCalledWith({
        name: "Premier League",
        parentId: "1",
      }),
    );
  });

  it("moves an existing subcategory to another parent", async () => {
    const user = userEvent.setup();
    updateCategory.mockResolvedValue({});
    vi.mocked(useCategories).mockReturnValue({
      data: [
        ...parents,
        { id: "3", name: "Baseball", parentId: -1, children: [] },
      ],
      isLoading: false,
    } as never);
    vi.mocked(useCategory).mockReturnValue({
      data: { id: "2", name: "Premier League", parentId: 1, children: [] },
      isLoading: false,
      isError: false,
    } as never);
    renderPage("/admin/categories/2/edit");
    await user.selectOptions(
      screen.getByLabelText("admin.categories.parent_selector"),
      "3",
    );
    await user.click(screen.getByRole("button", { name: "common.update" }));
    await waitFor(() =>
      expect(updateCategory).toHaveBeenCalledWith({
        id: "2",
        data: { name: "Premier League", parentId: "3" },
      }),
    );
  });

  it("adds a subcategory from a parent edit page", async () => {
    const user = userEvent.setup();
    addSubcategory.mockResolvedValue({});
    vi.mocked(useCategory).mockReturnValue({
      data: { id: "1", name: "Football", parentId: -1, children: [] },
      isLoading: false,
      isError: false,
    } as never);
    renderPage("/admin/categories/1/edit");
    await user.type(
      screen.getByLabelText("admin.categories.new_sub"),
      "Premier League",
    );
    await user.click(
      screen.getByRole("button", { name: "admin.categories.add" }),
    );
    await waitFor(() =>
      expect(addSubcategory).toHaveBeenCalledWith({
        categoryId: "1",
        name: "Premier League",
      }),
    );
  });
});
