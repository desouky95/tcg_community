import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Checklist } from "@tcg/api-contracts";
import {
  useAddChecklist,
  useChecklist,
  useUpdateChecklist,
} from "@tcg/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CollectionAddForm } from "./CollectionAddForm/CollectionAddForm";
import { CollectionEditForm } from "./CollectionEditForm/CollectionEditForm";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@hookform/devtools", () => ({ DevTool: () => null }));

vi.mock("@tcg/react-query", () => ({
  useAddChecklist: vi.fn(),
  useChecklist: vi.fn(),
  useUpdateChecklist: vi.fn(),
}));

vi.mock("../patterns/CategoriesSelect", () => ({
  CategoriesSelect: ({
    onValueChange,
    value,
  }: {
    onValueChange: (value: string) => void;
    value?: string;
  }) => (
    <select
      aria-label="admin.collections.category"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      <option value="">Select</option>
      <option value="football">Football</option>
    </select>
  ),
}));

const addChecklist = vi.fn();
const updateChecklist = vi.fn();

const checklist: Checklist = {
  id: "10",
  name: "Existing set",
  type: "card",
  year: 2024,
  totalCards: 100,
  categoryId: 1,
  subcategoryId: null,
  category: {
    id: "1",
    name: "Football",
    slug: "football",
    parentId: -1,
    children: [],
  },
  coverImageUrl: "http://localhost:3333/api/v1/checklists/10/cover?v=1",
};

function renderAddForm() {
  return render(
    <MemoryRouter initialEntries={["/admin/collections/new"]}>
      <Routes>
        <Route path="/admin/collections/new" element={<CollectionAddForm />} />
        <Route path="/admin/collections" element={<p>Checklist table</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderEditForm() {
  return render(
    <MemoryRouter initialEntries={["/admin/collections/10/edit"]}>
      <Routes>
        <Route
          path="/admin/collections/:id/edit"
          element={<CollectionEditForm />}
        />
        <Route path="/admin/collections" element={<p>Checklist table</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("admin checklist cover upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    addChecklist.mockResolvedValue({});
    updateChecklist.mockResolvedValue({});
    vi.mocked(useAddChecklist).mockReturnValue({
      isPending: false,
      mutateAsync: addChecklist,
    } as unknown as ReturnType<typeof useAddChecklist>);
    vi.mocked(useUpdateChecklist).mockReturnValue({
      isPending: false,
      mutateAsync: updateChecklist,
    } as unknown as ReturnType<typeof useUpdateChecklist>);
    vi.mocked(useChecklist).mockReturnValue({
      data: checklist,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useChecklist>);
  });

  afterEach(cleanup);

  it("submits the spreadsheet and cover as separate multipart fields", async () => {
    const user = userEvent.setup();
    const { container } = renderAddForm();
    const spreadsheet = new File(["cards"], "cards.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const cover = new File(["cover"], "cover.webp", { type: "image/webp" });

    await user.type(screen.getByPlaceholderText("admin.collections.name_placeholder"), "World Cup");
    await user.selectOptions(screen.getByLabelText("admin.collections.category"), "football");
    await user.upload(
      container.querySelector('input[accept=".xlsx,.xls"]') as HTMLInputElement,
      spreadsheet,
    );
    await user.upload(screen.getByLabelText("admin.collections.cover_image"), cover);
    await user.click(screen.getByRole("button", { name: "admin.collections.publish" }));

    await waitFor(() => expect(addChecklist).toHaveBeenCalledOnce());
    const payload = addChecklist.mock.calls[0][0] as FormData;
    expect(payload.get("file")).toBe(spreadsheet);
    expect(payload.get("coverImage")).toBe(cover);
  });

  it.each([
    [
      "unsupported type",
      new File(["cover"], "cover.gif", { type: "image/gif" }),
      "admin.collections.errors.cover_type",
    ],
    [
      "oversized file",
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "cover.png", {
        type: "image/png",
      }),
      "admin.collections.errors.cover_size",
    ],
  ])("rejects an %s", async (_case, cover, message) => {
    const user = userEvent.setup({ applyAccept: false });
    renderAddForm();

    await user.type(screen.getByPlaceholderText("admin.collections.name_placeholder"), "World Cup");
    await user.selectOptions(screen.getByLabelText("admin.collections.category"), "football");
    await user.upload(screen.getByLabelText("admin.collections.cover_image"), cover);
    await user.click(screen.getByRole("button", { name: "admin.collections.publish" }));

    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(addChecklist).not.toHaveBeenCalled();
  });

  it("keeps the existing cover when edit submits without a replacement", async () => {
    const user = userEvent.setup();
    renderEditForm();

    expect(screen.getByRole("img", { name: checklist.name })).toHaveAttribute(
      "src",
      checklist.coverImageUrl,
    );
    await user.click(screen.getByRole("button", { name: "admin.collections.publish" }));

    await waitFor(() => expect(updateChecklist).toHaveBeenCalledOnce());
    const request = updateChecklist.mock.calls[0][0] as {
      id: string;
      data: FormData;
    };
    expect(request.id).toBe("10");
    expect(request.data.has("coverImage")).toBe(false);
  });

  it("submits a replacement cover from edit", async () => {
    const user = userEvent.setup();
    renderEditForm();
    const replacement = new File(["replacement"], "replacement.jpg", {
      type: "image/jpeg",
    });

    await user.upload(
      screen.getByLabelText("admin.collections.cover_image"),
      replacement,
    );
    await user.click(screen.getByRole("button", { name: "admin.collections.publish" }));

    await waitFor(() => expect(updateChecklist).toHaveBeenCalledOnce());
    const request = updateChecklist.mock.calls[0][0] as { data: FormData };
    expect(request.data.get("coverImage")).toBe(replacement);
  });
});
