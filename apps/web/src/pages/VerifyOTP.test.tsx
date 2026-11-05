import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import VerifyOTP from "./VerifyOTP";

const { resend } = vi.hoisted(() => ({ resend: vi.fn().mockResolvedValue({}) }));
vi.mock("../hooks/useAuth", () => ({ useAuth: () => ({
  requestOtp: { mutateAsync: resend, isPending: false },
  verifyOtp: { mutateAsync: vi.fn(), isPending: false },
}) }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }) }));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));

describe("Signup verification handoff", () => {
  it("does not replace the signup challenge until the user explicitly requests another", async () => {
    render(<MemoryRouter initialEntries={[{ pathname: "/verify-otp", state: { mobile: "+201012345678" } }]}><VerifyOTP /></MemoryRouter>);
    expect(resend).not.toHaveBeenCalled();
    await userEvent.setup().click(screen.getByRole("button", { name: "Request another code" }));
    expect(resend).toHaveBeenCalledOnce();
    expect(resend).toHaveBeenCalledWith("+201012345678");
  });
});
