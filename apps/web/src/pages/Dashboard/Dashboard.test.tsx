import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { Dashboard } from "./Dashboard";
import { useDashboard } from "./dashboard.hook";

vi.mock("./dashboard.hook", () => ({ useDashboard: vi.fn() }));
vi.mock("../../components/Layout", () => ({ default: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("@tcg/ui-web", () => ({
  ChecklistCard: ({ checklist }: { checklist: { name: string } }) => <div>{checklist.name}</div>,
  ChecklistListItem: ({ checklist }: { checklist: { name: string } }) => <div>{checklist.name}</div>,
  Field: ({ children, label }: { children: ReactNode; label: string }) => <label>{label}{children}</label>,
  Input: (props: object) => <input {...props} />,
  LoadingGrid: () => <p role="status">Catalogue loading</p>,
  SectionHeading: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ViewToggle: () => <div />,
}));

const state = {
  categories: { data: [] },
  checklists: [{ id: 2, name: "Available set", slug: "available" }],
  summaries: [{ id: 1, name: "My set", slug: "mine", owned: 4, totalCards: 10, wanted: 2, offered: 1 }],
  summariesLoading: false, summariesError: false, isLoading: false, catalogueError: false,
  categorySelected: undefined, handleCategorySelect: vi.fn(), setViewMode: vi.fn(),
  t: (key: string) => key, viewMode: "grid" as const, query: "", setQuery: vi.fn(), clear: vi.fn(),
};

function showDashboard(overrides: Partial<typeof state> = {}) {
  vi.mocked(useDashboard).mockReturnValue({ ...state, ...overrides } as unknown as ReturnType<typeof useDashboard>);
  render(<MemoryRouter><Dashboard /></MemoryRouter>);
}

describe("Dashboard", () => {
  it("shows personal collections alongside the available catalogue", () => {
    showDashboard();
    expect(screen.getByRole("link", { name: /My set/ })).toHaveAttribute("href", "/collection/mine");
    expect(screen.getByText("Available set")).toBeInTheDocument();
  });
  it("keeps personal collections visible while the catalogue loads", () => {
    showDashboard({ isLoading: true });
    expect(screen.getByRole("link", { name: /My set/ })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Catalogue loading");
  });
  it("keeps the catalogue available when personal collections fail", () => {
    showDashboard({ summariesError: true });
    expect(screen.getByRole("alert")).toHaveTextContent("dashboard.my_collections_error");
    expect(screen.getByText("Available set")).toBeInTheDocument();
  });
});
