import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AccountSettings from "./AccountSettings";

const { get, put, post, changeLanguage, setTheme } = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
  changeLanguage: vi.fn(),
  setTheme: vi.fn(),
}));
vi.mock("../lib/api", () => ({ api: { http: { get, put, post } } }));
vi.mock("../components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("../components/ThemeProvider", () => ({
  useTheme: () => ({ setTheme }),
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: { changeLanguage } }),
}));
vi.mock("@tcg/react-query", () => ({
  useTcgSession: () => ({ clearSession: vi.fn() }),
}));

describe("Account settings", () => {
  beforeEach(() => {
    get.mockReset();
    put.mockReset();
    post.mockReset();
    changeLanguage.mockReset();
    setTheme.mockReset();
    get.mockImplementation((path: string) =>
      Promise.resolve({
        data: {
          data: path.endsWith("preferences")
            ? { locale: "en", theme: "system", privacy: {}, communication: {} }
            : [],
        },
      }),
    );
  });
  it("saves privacy and language preferences", async () => {
    put.mockResolvedValue({});
    render(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <MemoryRouter>
          <AccountSettings />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    const language = await screen.findByLabelText("Language");
    const user = userEvent.setup();
    await user.selectOptions(language, "ar");
    await user.click(screen.getByLabelText("Show public profile"));
    await user.click(screen.getByRole("button", { name: "Save settings" }));
    await waitFor(() =>
      expect(put).toHaveBeenCalledWith(
        "/account/preferences",
        expect.objectContaining({
          locale: "ar",
          privacy: expect.objectContaining({ showProfile: false }),
        }),
      ),
    );
    expect(changeLanguage).toHaveBeenCalledWith("ar");
  });
  it("requires explicit confirmation before deactivation", async () => {
    render(
      <QueryClientProvider
        client={
          new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
      >
        <MemoryRouter>
          <AccountSettings />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await screen.findByLabelText("Language");
    const button = screen.getByRole("button", { name: "Deactivate account" });
    expect(button).toBeDisabled();
    await userEvent
      .setup()
      .type(screen.getByLabelText("Type DEACTIVATE to confirm"), "DEACTIVATE");
    expect(button).toBeEnabled();
    expect(post).not.toHaveBeenCalled();
  });
});
