import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("renders a labelled shared input and reports changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SearchInput
        value=""
        onChange={onChange}
        placeholder="Search catalogues"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Search catalogues" });
    expect(input).toHaveClass("ui-control");

    await user.type(input, "yugi");
    expect(onChange).toHaveBeenCalledWith("y");
  });
});
