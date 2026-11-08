import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AxiosError } from "axios";
import Login from "./Login";

const { login, navigate, toastError } = vi.hoisted(() => ({ login: vi.fn(), navigate: vi.fn(), toastError: vi.fn() }));
vi.mock("../hooks/useAuth", () => ({ useAuth: () => ({ login: { mutateAsync: login, isPending: false } }) }));
vi.mock("react-router-dom", async (original) => ({ ...(await original<typeof import("react-router-dom")>()), useNavigate: () => navigate }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }) }));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: toastError } }));

async function submit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email, username, or mobile"), "collector");
  await user.type(screen.getByLabelText("Password"), "password123");
  await user.click(screen.getByRole("button", { name: "Sign in" }));
}

describe("Password sign in", () => {
  beforeEach(() => { login.mockReset(); navigate.mockReset(); toastError.mockReset(); });
  it("opens the dashboard after authentication completes", async () => {
    login.mockResolvedValue({});
    render(<MemoryRouter><Login /></MemoryRouter>);
    await submit();
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/dashboard"));
  });
  it("directs unverified users to verification", async () => {
    login.mockRejectedValue(new AxiosError("unverified", "", undefined, undefined, { status: 403, data: { unverified: true, mobile: "+201012345678" }, statusText: "", headers: {}, config: {} as never }));
    render(<MemoryRouter><Login /></MemoryRouter>);
    await submit();
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/verify-otp", { state: { mobile: "+201012345678" } }));
  });
  it("reports structured errors without navigating", async () => {
    login.mockRejectedValue(new AxiosError("blocked", "", undefined, undefined, { status: 403, data: { error: { message: "Account unavailable" } }, statusText: "", headers: {}, config: {} as never }));
    render(<MemoryRouter><Login /></MemoryRouter>);
    await submit();
    await waitFor(() => expect(toastError).toHaveBeenCalledWith("Account unavailable"));
    expect(navigate).not.toHaveBeenCalled();
  });
});
