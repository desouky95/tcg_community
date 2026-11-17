import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "../../../apps/public-web/node_modules/@tanstack/react-query/build/modern/index.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PreferencesSection } from "../../../apps/public-web/app/(shared-layout)/account/account-settings";
import { AddressesSection } from "../../../apps/public-web/app/(shared-layout)/account/commerce-sections";

Element.prototype.scrollIntoView = vi.fn();
const mocks = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn(), delete: vi.fn(), post: vi.fn() }));
vi.mock("../../../apps/public-web/src/lib/api", () => ({ api: { http: mocks } }));
const prefs = { locale: "en", theme: "system", privacy: { showProfile: true, showCollection: false }, communication: { email: false, whatsapp: true } };
const address = { id: "addr_1", first_name: "Test", last_name: "User", address_1: "Main St", city: "Cairo", country_code: "eg" };
function mount(child) { return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>{child}</QueryClientProvider>); }
describe("account shared components", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.get.mockImplementation(async (path) => path.endsWith("preferences") ? { data: { data: prefs } } : { data: { addresses: [address] } }); });
  it("preserves preference defaults and submits Radix checkbox values", async () => {
    mocks.put.mockImplementation(async (_, data) => ({ data: { data } }));
    const user = userEvent.setup(); mount(<PreferencesSection userId="1" />);
    const profile = await screen.findByRole("checkbox", { name: "Show my public profile" });
    expect(profile).toBeChecked(); expect(screen.getByRole("checkbox", { name: "Show my collection" })).not.toBeChecked();
    await user.click(profile); await user.click(screen.getByRole("checkbox", { name: "Email" }));
    const language = screen.getByRole("combobox", { name: "Language" });
    language.focus(); await user.keyboard("{Enter}"); await user.click(await screen.findByRole("option", { name: "Arabic" }));
    const theme = screen.getByRole("combobox", { name: "Theme" });
    theme.focus(); await user.keyboard("{Enter}"); await user.click(await screen.findByRole("option", { name: "Dark" }));
    await user.click(screen.getByRole("button", { name: "Save preferences" }));
    await waitFor(() => expect(mocks.put).toHaveBeenCalledWith("/account/preferences", expect.objectContaining({ locale: "ar", theme: "dark", privacy: { showProfile: false, showCollection: false }, communication: { email: true, whatsapp: true } })));
  });
  it("supports cancel, escape and confirmation for address deletion", async () => {
    mocks.delete.mockResolvedValue({}); const user = userEvent.setup(); mount(<AddressesSection userId="1" />);
    const trigger = await screen.findByRole("button", { name: "Delete address for Test User" });
    await user.click(trigger); let dialog = await screen.findByRole("alertdialog", { name: "Delete this address?" });
    await user.click(within(dialog).getByRole("button", { name: "Cancel" })); expect(mocks.delete).not.toHaveBeenCalled();
    expect(trigger).toHaveFocus(); await user.click(trigger); await user.keyboard("{Escape}"); expect(mocks.delete).not.toHaveBeenCalled();
    await user.click(trigger); dialog = await screen.findByRole("alertdialog"); await user.click(within(dialog).getByRole("button", { name: "Delete address" }));
    await waitFor(() => expect(mocks.delete).toHaveBeenCalledWith("/account/commerce/addresses/addr_1"));
  });
});
