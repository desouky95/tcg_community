import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useAddChecklist,
  useChecklist,
  useDeleteChecklist,
  useUpdateChecklist,
} from "../../../hooks/useChecklists";
import { useCategories } from "../../../hooks/useCategories";
import AdminCollectionFormPage from "./AdminCollectionFormPage";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../hooks/useChecklists", () => ({
  useAddChecklist: vi.fn(),
  useChecklist: vi.fn(),
  useDeleteChecklist: vi.fn(),
  useUpdateChecklist: vi.fn(),
}));

vi.mock("../../hooks/useCategories", () => ({
  useCategories: vi.fn(),
}));

const addChecklist = vi.fn();
const updateChecklist = vi.fn();
const deleteChecklist = vi.fn();

function renderPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/collections/new" element={<AdminCollectionFormPage />} />
        <Route path="/admin/collections/:id/edit" element={<AdminCollectionFormPage />} />
        <Route path="/admin/collections" element={<p>Checklist table</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminCollectionFormPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useChecklist).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useChecklist>);
    vi.mocked(useCategories).mockReturnValue({
      data: [
        {
          id: "1",
          name: "Football",
          parentId: -1,
          children: [{ id: "2", name: "Premier League", parentId: 1, children: [] }],
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useCategories>);
    vi.mocked(useAddChecklist).mockReturnValue({
      isPending: false,
      mutateAsync: addChecklist,
    } as unknown as ReturnType<typeof useAddChecklist>);
    vi.mocked(useUpdateChecklist).mockReturnValue({
      isPending: false,
      mutateAsync: updateChecklist,
    } as unknown as ReturnType<typeof useUpdateChecklist>);
    vi.mocked(useDeleteChecklist).mockReturnValue({
      isPending: false,
      mutateAsync: deleteChecklist,
    } as unknown as ReturnType<typeof useDeleteChecklist>);
  });

  it("creates a checklist with the selected taxonomy", async () => {
    const user = userEvent.setup();
    addChecklist.mockResolvedValue({});
    renderPage("/admin/collections/new");

    await user.type(screen.getByLabelText("admin.collections.name"), "World Cup 2022");
    await user.selectOptions(screen.getByLabelText("admin.collections.category"), "1");
    await user.selectOptions(screen.getByLabelText("admin.collections.sub"), "2");
    await user.click(screen.getByRole("button", { name: "admin.collections.publish" }));

    await waitFor(() => expect(addChecklist).toHaveBeenCalledOnce());
    const payload = addChecklist.mock.calls[0][0] as FormData;
    expect(payload.get("name")).toBe("World Cup 2022");
    expect(payload.get("categoryId")).toBe("1");
    expect(payload.get("subcategoryId")).toBe("2");
    expect(screen.getByText("Checklist table")).toBeInTheDocument();
  });

  it("updates an existing checklist without requiring a replacement file", async () => {
    const user = userEvent.setup();
    updateChecklist.mockResolvedValue({});
    vi.mocked(useChecklist).mockReturnValue({
      data: {
        id: "10",
        name: "Existing set",
        type: "card",
        year: 2024,
        totalCards: 100,
        categoryId: 1,
        subcategoryId: null,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useChecklist>);
    renderPage("/admin/collections/10/edit");

    await user.clear(screen.getByLabelText("admin.collections.name"));
    await user.type(screen.getByLabelText("admin.collections.name"), "Updated set");
    await user.click(screen.getByRole("button", { name: "common.update" }));

    await waitFor(() => expect(updateChecklist).toHaveBeenCalledOnce());
    const request = updateChecklist.mock.calls[0][0] as { id: string; data: FormData };
    expect(request.id).toBe("10");
    expect(request.data.get("name")).toBe("Updated set");
    expect(request.data.has("file")).toBe(false);
  });

  it("archives an existing checklist only after confirmation", async () => {
    const user = userEvent.setup();
    deleteChecklist.mockResolvedValue({});
    vi.mocked(useChecklist).mockReturnValue({
      data: {
        id: "10",
        name: "Existing set",
        type: "card",
        year: 2024,
        totalCards: 100,
        categoryId: 1,
        subcategoryId: null,
      },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useChecklist>);
    renderPage("/admin/collections/10/edit");

    await user.click(screen.getByRole("button", { name: "admin.collections.delete" }));
    expect(deleteChecklist).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "admin.collections.confirm_delete" }));

    await waitFor(() => expect(deleteChecklist).toHaveBeenCalledWith("10"));
  });
});
