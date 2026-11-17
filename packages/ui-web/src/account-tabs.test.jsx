import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "../../../apps/public-web/node_modules/@tanstack/react-query/build/modern/index.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TcgApiProvider } from "../../react-query/src/provider";
import { AccountHub } from "../../../apps/public-web/app/(shared-layout)/account/account-hub";

vi.mock("../../../apps/public-web/src/lib/api", () => ({ api: { getProfile: vi.fn(async () => ({ data: { data: { id: 1, fullName: "Test User", username: "tester", mobile: "+201000000000" } } })), logout: vi.fn() } }));
vi.mock("../../../apps/public-web/app/(shared-layout)/account/commerce-sections", () => ({ OrdersSection: () => <p>Orders content</p>, AddressesSection: () => <p>Addresses content</p> }));
vi.mock("../../../apps/public-web/app/(shared-layout)/account/account-settings", () => ({ PreferencesSection: () => <p>Preferences content</p>, PrivacySection: () => <p>Privacy content</p> }));

Element.prototype.scrollIntoView = vi.fn();
const updateProfile = vi.fn(async (data) => ({ data: { data: { user: { id: 1, fullName: data.fullName, username: "tester", mobile: data.mobile, governorate: data.governorate, isVerified: true } } } }));
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><TcgApiProvider client={{ updateProfile }} isAuthenticated><AccountHub /></TcgApiProvider></QueryClientProvider>);
}

describe("account tabs", () => {
  beforeEach(() => window.history.replaceState(null, "", "/account"));
  it("opens URL tabs and falls back to profile for invalid values", async () => {
    window.history.replaceState(null, "", "/account?tab=orders&source=header");
    mount();
    expect(await screen.findByText("Orders content")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Orders" })).toHaveAttribute("aria-selected", "true");
    window.history.pushState(null, "", "/account?tab=invalid");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(await screen.findByRole("button", { name: "Edit profile" })).toBeInTheDocument();
  });
  it("updates the URL and restores tabs on history navigation", async () => {
    const user = userEvent.setup(); mount();
    await screen.findByRole("button", { name: "Edit profile" });
    window.history.replaceState(null, "", "/account?source=header");
    await user.click(screen.getByRole("tab", { name: "Orders" }));
    expect(window.location.search).toContain("tab=orders");
    expect(window.location.search).toContain("source=header");
    window.history.pushState(null, "", "/account?tab=addresses");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(await screen.findByText("Addresses content")).toBeInTheDocument();
  });
  it("uses vertical keyboard navigation on desktop", async () => {
    const original = window.matchMedia;
    window.matchMedia = () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} });
    try {
      const user = userEvent.setup(); mount();
      const tab = await screen.findByRole("tab", { name: "Profile" });
      expect(screen.getByRole("tablist", { name: "Account sections" })).toHaveAttribute("aria-orientation", "vertical");
      tab.focus(); await user.keyboard("{ArrowDown}{Enter}");
      expect(await screen.findByText("Orders content")).toBeInTheDocument();
    } finally { window.matchMedia = original; }
  });
  it("submits the selected governorate", async () => {
    const user = userEvent.setup(); mount();
    await user.click(await screen.findByRole("button", { name: "Edit profile" }));
    screen.getByRole("combobox", { name: "Governorate" }).focus();
    await user.keyboard("{Enter}"); await user.click(await screen.findByRole("option", { name: "Giza" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ governorate: "Giza" })));
  });
  it("discards unsaved edits when switching tabs and supports keyboard activation", async () => {
    const user = userEvent.setup(); mount();
    await user.click(await screen.findByRole("button", { name: "Edit profile" }));
    expect(screen.getByRole("combobox", { name: "Governorate" })).toBeInTheDocument();
    const name = screen.getByLabelText("Full name");
    await user.clear(name); await user.type(name, "Unsaved name");
    const profileTab = screen.getByRole("tab", { name: "Profile" });
    profileTab.focus(); await user.keyboard("{ArrowRight}{Enter}");
    expect(await screen.findByText("Orders content")).toBeInTheDocument();
    await user.click(profileTab);
    expect(await screen.findByText("Test User", { selector: "dd" })).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Unsaved name")).not.toBeInTheDocument();
  });
});
