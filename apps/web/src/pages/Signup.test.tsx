import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";

const { mutateAsync, navigate } = vi.hoisted(() => ({ mutateAsync: vi.fn(), navigate: vi.fn() }));
vi.mock("../hooks/useAuth", () => ({ useAuth: () => ({ signup: { mutateAsync, isPending: false } }) }));
vi.mock("react-router-dom", async (importOriginal) => ({ ...(await importOriginal<typeof import("react-router-dom")>()), useNavigate: () => navigate }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }) }));
vi.mock("../components/common/PhoneNumber", () => ({ PhoneNumber: ({ register, name, ...props }: any) => <input {...props} {...register(name)} /> }));

async function fillForm(password = "password123") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Full name"), "Test Collector");
  await user.type(screen.getByLabelText("Username"), "collector1");
  await user.type(screen.getByLabelText("Email"), "collector@example.com");
  await user.type(screen.getByLabelText("Mobile / WhatsApp"), "+201012345678");
  await user.type(screen.getByLabelText("Password", { exact: true }), password);
  await user.type(screen.getByLabelText("Confirm password"), password);
  await user.selectOptions(screen.getByLabelText("common.region"), "Cairo");
  return user;
}

describe("Signup", () => {
  beforeEach(() => { mutateAsync.mockReset(); navigate.mockReset(); });
  it("offers both social providers", () => {
    render(<MemoryRouter><Signup /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Continue with Google" })).toHaveAttribute("href", expect.stringContaining("/api/v1/auth/oauth/google/redirect"));
    expect(screen.getByRole("link", { name: "Continue with Facebook" })).toHaveAttribute("href", expect.stringContaining("/api/v1/auth/oauth/facebook/redirect"));
  });
  it("preserves the destination in both social sign-in links", () => {
    render(<MemoryRouter initialEntries={["/signup?returnTo=%2Fdashboard%3Ftab%3Dcards"]}><Signup /></MemoryRouter>);
    for (const name of ["Continue with Google", "Continue with Facebook"]) {
      const url = new URL(screen.getByRole("link", { name }).getAttribute("href")!);
      expect(url.searchParams.get("returnTo")).toBe("/dashboard?tab=cards");
    }
  });
  it("rejects passwords shorter than the API minimum", async () => {
    render(<MemoryRouter><Signup /></MemoryRouter>);
    const user = await fillForm("short12");
    await user.click(screen.getByRole("button", { name: "Create my profile" }));
    expect(await screen.findByText("Password must be at least 8 characters")).toBeInTheDocument();
    expect(mutateAsync).not.toHaveBeenCalled();
  });
  it("moves to verification only after registration succeeds", async () => {
    mutateAsync.mockResolvedValue({});
    render(<MemoryRouter><Signup /></MemoryRouter>);
    const user = await fillForm();
    await user.click(screen.getByRole("button", { name: "Create my profile" }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/verify-otp", { state: { mobile: "+201012345678" } }));
  });
  it("retains the form and shows an error after a failed request", async () => {
    mutateAsync.mockRejectedValue(new Error("offline"));
    render(<MemoryRouter><Signup /></MemoryRouter>);
    const user = await fillForm();
    await user.click(screen.getByRole("button", { name: "Create my profile" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Registration could not be completed");
    expect(screen.getByLabelText("Username")).toHaveValue("collector1");
    expect(navigate).not.toHaveBeenCalled();
  });
});
