import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CollectionControls from "./CollectionControls";

const { get, post, patch, put } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  put: vi.fn(),
}));
vi.mock("../../lib/api", () => ({ api: { http: { get, post, patch, put } } }));
vi.mock("@tcg/react-query", () => ({
  useTcgSession: () => ({ user: { id: 1 } }),
}));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
const details = {
  version: 1,
  visibility: "private",
  shareToken: null,
  entries: [
    {
      cardId: 1,
      number: "1",
      name: "First",
      quantity: 1,
      offeredQuantity: 0,
      wanted: false,
    },
  ],
};

describe("Collection controls", () => {
  beforeEach(() => {
    get.mockReset();
    post.mockReset();
    patch.mockReset();
    put.mockReset();
  });
  it("offers to start a collection when it does not exist", async () => {
    get
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValue({ data: { data: details } });
    post.mockResolvedValue({});
    render(<CollectionControls id="test" revision={0} />);
    await userEvent
      .setup()
      .click(await screen.findByRole("button", { name: "Start collection" }));
    await waitFor(() =>
      expect(post).toHaveBeenCalledWith("/user-checklists/test/start"),
    );
    expect(await screen.findByLabelText("Visibility")).toHaveTextContent(
      "Private",
    );
  });
  it("shows collection settings without the per-card editor", async () => {
    get.mockResolvedValue({ data: { data: details } });
    render(<CollectionControls id="test" revision={0} />);
    expect(await screen.findByLabelText("Visibility")).toHaveTextContent(
      "Private",
    );
    expect(
      screen.getByRole("button", { name: "Export my collection" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Edit quantities and wanted cards"),
    ).not.toBeInTheDocument();
  });
  it("updates visibility when a new option is chosen", async () => {
    get.mockResolvedValue({ data: { data: details } });
    put.mockResolvedValue({});
    Element.prototype.scrollIntoView = vi.fn();
    const user = userEvent.setup();
    render(<CollectionControls id="test" revision={0} />);
    const trigger = await screen.findByRole("combobox", { name: "Visibility" });
    trigger.focus();
    await user.keyboard("{Enter}");
    await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(put).toHaveBeenCalledWith(
      "/user-checklists/test/visibility",
      { expectedVersion: 1, visibility: "unlisted" },
    ));
  });

});
