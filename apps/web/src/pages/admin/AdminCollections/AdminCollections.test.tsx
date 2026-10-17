import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useChecklists } from "../../../hooks/useChecklists";
import AdminCollections from "./AdminCollections";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../../hooks/useChecklists", () => ({
  useChecklists: vi.fn(),
}));

const mockedUseChecklists = vi.mocked(useChecklists);

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/admin/collections"]}>
      <Routes>
        <Route path="/admin/collections" element={<AdminCollections />} />
        <Route path="/admin/collections/new" element={<p>Create checklist</p>} />
        <Route path="/admin/collections/:id/edit" element={<p>Edit checklist</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminCollections", () => {
  beforeEach(() => {
    mockedUseChecklists.mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useChecklists>);
  });

  it("routes the main CTA to checklist creation", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("link", { name: /admin.collections.new/ }));
    expect(screen.getByText("Create checklist")).toBeInTheDocument();
  });

  it("renders an empty table state", () => {
    renderPage();
    expect(screen.getByText("admin.collections.empty_title")).toBeInTheDocument();
  });

  it("opens the selected checklist edit page", async () => {
    const user = userEvent.setup();
    mockedUseChecklists.mockReturnValue({
      data: [
        {
          id: "12",
          name: "World Cup 2022",
          type: "sticker",
          year: 2022,
          totalCards: 670,
          categoryId: 1,
          subcategoryId: null,
          category: { id: "1", name: "Football", parentId: -1, children: [] },
        },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useChecklists>);
    renderPage();

    await user.click(screen.getByRole("link", { name: /World Cup 2022/ }));
    expect(screen.getByText("Edit checklist")).toBeInTheDocument();
  });
});
