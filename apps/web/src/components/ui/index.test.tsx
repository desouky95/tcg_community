import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button, Field, Input, StatusBadge, Surface } from ".";

describe("UI primitives", () => {
  it("renders button variants and exposes loading state", () => {
    render(<Button loading variant="outline" tone="accent">Save</Button>);
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
        <button type="button">Open</button>
      </>,
    );

    expect(screen.getByText("Panel")).toHaveAttribute("data-tone", "accent");
    expect(screen.getByText("Ready")).toHaveAttribute("data-tone", "success");
    await user.click(screen.getByRole("button", { name: "Open" }));
  });
});
