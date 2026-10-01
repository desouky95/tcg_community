import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Button,
  Checkbox,
  Dialog,
  EmptyState,
  Field,
  Input,
  StatusBadge,
  Surface,
  Tabs,
  TextLink,
  SearchRail,
  ActivityPanel,
  ListingPreview,
} from ".";

describe("UI primitives", () => {
  it("renders button variants and exposes loading state", () => {
    render(
      <Button loading variant="outline" tone="accent">
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-state", "loading");
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-tone", "accent");
  });

  it("connects field labels and reports validation errors", () => {
    render(
      <Field label="Email" htmlFor="email" error="Email is required">
        <Input id="email" aria-describedby="email-description" />
      </Field>,
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
    expect(screen.getByRole("textbox")).toHaveClass("ui-control");
  });

  it("keeps semantic visual state on non-interactive primitives", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Surface tone="accent">Panel</Surface>
        <StatusBadge tone="success">Ready</StatusBadge>
        <EmptyState>No cards yet</EmptyState>
        <button type="button">Open</button>
      </>,
    );

    expect(screen.getByText("Panel")).toHaveAttribute("data-tone", "accent");
    expect(screen.getByText("Ready")).toHaveAttribute("data-tone", "success");
    expect(screen.getByText("No cards yet")).toHaveClass("ui-empty-state");
    await user.click(screen.getByRole("button", { name: "Open" }));
  });

  it("supports route adapters through asChild", () => {
    render(
      <>
        <Button asChild>
          <a href="/dashboard">Dashboard</a>
        </Button>
        <TextLink asChild>
          <a href="/marketplace">Marketplace</a>
        </TextLink>
      </>,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveClass("ui-button");
    expect(screen.getByRole("link", { name: "Marketplace" })).toHaveClass("ui-text-link");
  });

  it("opens dialog content through the shared Radix wrapper", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root modal={false}>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Trade request</Dialog.Title>
            <Dialog.Description>Confirm the card swap.</Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Trade request")).toBeInTheDocument();
  });

  it("keeps tabs and checkbox state in Radix wrappers", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tabs.Root defaultValue="cards">
          <Tabs.List>
            <Tabs.Trigger value="cards">Cards</Tabs.Trigger>
            <Tabs.Trigger value="packs">Packs</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="cards">Card grid</Tabs.Content>
          <Tabs.Content value="packs">Pack grid</Tabs.Content>
        </Tabs.Root>
        <Checkbox aria-label="Include traded cards" />
      </>,
    );

    expect(screen.getByText("Card grid")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Packs" }));
    expect(screen.getByText("Pack grid")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox", { name: "Include traded cards" });
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");
  });

  it("associates generated field labels and errors with the control", () => {
    render(<Field label="Collector email" error="Enter an email"><Input type="email" /></Field>);
    const input = screen.getByRole("textbox", { name: "Collector email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", `${input.id}-error`);
    expect(screen.getByRole("alert")).toHaveAttribute("id", `${input.id}-error`);
  });

  it("prevents activation of a disabled slotted link and its child handler", async () => {
    const user = userEvent.setup();
    const childClick = vi.fn();
    const parentClick = vi.fn();
    render(<Button asChild disabled onClick={parentClick}><a href="/checkout" onClick={childClick}>Checkout</a></Button>);
    const link = screen.getByRole("link", { name: "Checkout" });
    await user.click(link);
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(childClick).not.toHaveBeenCalled();
    expect(parentClick).not.toHaveBeenCalled();
  });

  it("keeps popular-search and explicit-search values in sync", async () => {
    const user = userEvent.setup();
    const search = vi.fn();
    render(<SearchRail popularQueries={["Football"]} onSearch={search} />);
    await user.click(screen.getByRole("button", { name: "Football" }));
    expect(screen.getByRole("searchbox")).toHaveValue("Football");
    expect(search).toHaveBeenCalledWith("Football");
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "2025");
    await user.click(screen.getByRole("button", { name: "Search", exact: true }));
    expect(search).toHaveBeenLastCalledWith("2025");
  });

  it("discloses demo activity and labels listing previews", () => {
    render(<><ActivityPanel items={[{ id: "a", name: "Collector", action: "listed a card", location: "Cairo", time: "now" }]} /><ListingPreview href="/marketplace/1" name="Example" set="2025" condition="Near mint" image="/card.jpg" /></>);
    expect(screen.getByText("DEMONSTRATION")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Example/ })).toHaveAttribute("href", "/marketplace/1");
  });
});
