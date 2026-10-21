import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Collection } from "./Collection";
import { useCollectionPage } from "./collection.hook";

vi.mock("./collection.hook", () => ({
  useCollectionPage: vi.fn(),
}));

vi.mock("../../components/Layout", () => ({
  default: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

const mockUseCollectionPage = vi.mocked(useCollectionPage);

function createPageState(currentUser: object | null = { id: "user-1" }) {
  const headers = [
    {
      id: "number",
      index: 0,
      label: "Number",
      column: {
        getCanSort: () => true,
        getIsSorted: () => false,
        getToggleSortingHandler: () => vi.fn(),
      },
    },
    {
      id: "name",
      index: 1,
      label: "Name",
      column: {
        getCanSort: () => false,
        getIsSorted: () => false,
        getToggleSortingHandler: () => undefined,
      },
    },
  ];

  return {
    currentUser,
    resetFilters: vi.fn(),
    t: (key: string) => key,
    stats: { cards: 100, wanted: 12, held: 40, offered: 8 },
    collection: {
      name: "A Very Long World Cup Collection Name",
      year: 2022,
      coverImageUrl: "/cover.jpg",
      category: { name: "Football" },
    },
    isLoading: false,
    query: "",
    filters: [],
    handleDownloadExcel: vi.fn(),
    id: "collection-1",
    breadcrumb: [{ name: "World Cup", slug: "world-cup" }],
    table: {
      state: { globalFilter: "" },
      setGlobalFilter: vi.fn(),
      getHeaderGroups: () => [{ id: "headers", headers }],
      getRowModel: () => ({
        rows: [
          {
            id: "card-1",
            getVisibleCells: () => [
              { id: "number-cell", value: "001" },
              { id: "name-cell", value: "Test Card" },
            ],
          },
        ],
      }),
      FlexRender: ({
        header,
        cell,
      }: {
        header?: (typeof headers)[number];
        cell?: { value: string };
      }) => header?.label ?? cell?.value ?? null,
    },
    meta: undefined,
    isLoadingCards: false,
  };
}

function renderCollection() {
  return render(
    <MemoryRouter>
      <Collection />
    </MemoryRouter>,
  );
}

describe("Collection", () => {
  beforeEach(() => {
    mockUseCollectionPage.mockReturnValue(createPageState() as never);
  });

  it("keeps the card index accessible and exposes sorting only where supported", () => {
    renderCollection();

    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getByRole("region", { name: "Card index" })).toBeVisible();
    expect(
      screen.getByRole("searchbox", { name: "Search card index" }),
    ).toBeVisible();

    const sortableHeader = screen.getByRole("columnheader", {
      name: "Number",
    });
    expect(sortableHeader).toHaveAttribute("aria-sort", "none");
    expect(
      within(sortableHeader).getByRole("button", { name: "Number" }),
    ).toBeVisible();

    const staticHeader = screen.getByRole("columnheader", { name: "Name" });
    expect(staticHeader).not.toHaveAttribute("aria-sort");
    expect(within(staticHeader).queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows the edit action only for an authenticated collector", () => {
    const { unmount } = renderCollection();

    expect(
      screen.getByRole("button", { name: "Download checklist" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Edit my list" })).toHaveAttribute(
      "href",
      "/collection/collection-1/edit",
    );

    unmount();
    mockUseCollectionPage.mockReturnValue(createPageState(null) as never);
    renderCollection();

    expect(
      screen.queryByRole("link", { name: "Edit my list" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Download checklist" }),
    ).toBeVisible();
  });
});
