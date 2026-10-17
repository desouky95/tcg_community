import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBlockUser, useUsers } from "../../hooks/useUsers";
import AdminUsers from "./AdminUsers";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../hooks/useUsers", () => ({
  useUsers: vi.fn(),
  useBlockUser: vi.fn(),
}));

const mockedUseUsers = vi.mocked(useUsers);
const mockedUseBlockUser = vi.mocked(useBlockUser);
const blockUser = vi.fn();

const member = {
  id: "7",
  fullName: "Nadia Collector",
  username: "nadia",
  email: null,
  mobile: "+201000000000",
  role: "admin" as const,
  blocked: false,
  points: 42,
  positiveReviewsCount: 0,
  negativeReviewsCount: 0,
  lastLoginAt: null,
  governorate: null,
  notReadyForSwap: false,
  isVerified: true,
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/admin/users"]}>
      <Routes>
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/profile/:id" element={<p>Profile page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AdminUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseUsers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);
    mockedUseBlockUser.mockReturnValue({
      isPending: false,
      mutateAsync: blockUser,
    } as unknown as ReturnType<typeof useBlockUser>);
  });

  it("renders loading, empty, and error table states", () => {
    mockedUseUsers.mockReturnValueOnce({
      data: [],
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);
    const { rerender } = renderPage();
    expect(screen.getByRole("status")).toHaveTextContent("common.loading");

    mockedUseUsers.mockReturnValueOnce({
      data: [],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);
    rerender(
      <MemoryRouter initialEntries={["/admin/users"]}>
        <AdminUsers />
      </MemoryRouter>,
    );
    expect(screen.getByText("admin.users.empty_title")).toBeInTheDocument();

    mockedUseUsers.mockReturnValueOnce({
      data: [],
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useUsers>);
    rerender(
      <MemoryRouter initialEntries={["/admin/users"]}>
        <AdminUsers />
      </MemoryRouter>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("admin.users.error_title");
  });

  it("provides semantic keyboard navigation to a member profile", async () => {
    const user = userEvent.setup();
    mockedUseUsers.mockReturnValue({
      data: [member],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);
    renderPage();

    const profileLink = screen.getByRole("link", { name: /Nadia Collector/ });
    expect(profileLink).toHaveAttribute("href", "/profile/7");
    await user.click(profileLink);
    expect(screen.getByText("Profile page")).toBeInTheDocument();
  });

  it("marks blocked rows and isolates the access action from row navigation", async () => {
    const user = userEvent.setup();
    blockUser.mockResolvedValue({});
    mockedUseUsers.mockReturnValue({
      data: [{ ...member, blocked: true }],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useUsers>);
    renderPage();

    expect(screen.getByText("Nadia Collector").closest("tr")).toHaveAttribute(
      "data-tone",
      "danger",
    );
    await user.click(screen.getByRole("button", { name: "admin.users.unblock" }));

    await waitFor(() =>
      expect(blockUser).toHaveBeenCalledWith({ id: "7", blocked: false }),
    );
    expect(screen.queryByText("Profile page")).not.toBeInTheDocument();
  });
});
