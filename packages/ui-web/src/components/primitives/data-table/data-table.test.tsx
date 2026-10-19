import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from ".";

describe("DataTable", () => {
  it("renders semantic table elements and merges consumer classes", () => {
    render(
      <DataTable.Root className="custom-root" scrollLabel="Members table">
        <DataTable.Table className="min-w-96">
          <DataTable.Header>
            <DataTable.Row>
              <DataTable.Head>Name</DataTable.Head>
              <DataTable.Head align="end">Count</DataTable.Head>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body>
            <DataTable.Row interactive tone="danger" className="custom-row">
              <DataTable.Cell>Collector</DataTable.Cell>
              <DataTable.Cell align="end">12</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>,
    );

    expect(screen.getByRole("table")).toHaveClass("min-w-96");
    expect(
      screen.getByRole("region", { name: "Members table" }),
    ).toHaveAttribute("tabindex", "0");
    expect(screen.getByText("Name").closest("th")).toHaveAttribute(
      "data-align",
      "start",
    );
    expect(screen.getByText("Count").closest("th")).toHaveAttribute(
      "data-align",
      "end",
    );
    expect(screen.getByText("12").closest("td")).toHaveAttribute(
      "data-align",
      "end",
    );

    const dataRow = screen.getByText("Collector").closest("tr");
    expect(dataRow).toHaveClass("custom-row");
    expect(dataRow).toHaveAttribute("data-interactive", "true");
    expect(dataRow).toHaveAttribute("data-tone", "danger");
  });

  it("supports captions, sticky headers, and footers", () => {
    render(
      <DataTable.Root>
        <DataTable.Table>
          <DataTable.Caption>Collection counts</DataTable.Caption>
          <DataTable.Header sticky>
            <DataTable.Row>
              <DataTable.Head>Name</DataTable.Head>
            </DataTable.Row>
          </DataTable.Header>
          <DataTable.Body>
            <DataTable.Row>
              <DataTable.Cell>Collector</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Body>
          <DataTable.Footer>
            <DataTable.Row>
              <DataTable.Cell>Total: 1</DataTable.Cell>
            </DataTable.Row>
          </DataTable.Footer>
        </DataTable.Table>
      </DataTable.Root>,
    );

    expect(
      screen.getByText("Collection counts").closest("caption"),
    ).toBeVisible();
    expect(screen.getByText("Name").closest("thead")).toHaveAttribute(
      "data-sticky",
      "true",
    );
    expect(screen.getByText("Total: 1").closest("tfoot")).toBeInTheDocument();
  });

  it("spans state content across columns", () => {
    render(
      <DataTable.Root>
        <DataTable.Table>
          <DataTable.Body>
            <DataTable.StateRow colSpan={4}>No results</DataTable.StateRow>
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>,
    );

    expect(screen.getByText("No results").closest("td")).toHaveAttribute(
      "colspan",
      "4",
    );
  });

  it("announces loading once while rendering the requested skeleton rows", () => {
    render(
      <DataTable.Root>
        <DataTable.Table>
          <DataTable.Body aria-busy="true">
            <DataTable.LoadingRows
              columns={3}
              rows={2}
              label="Loading members"
            />
          </DataTable.Body>
        </DataTable.Table>
      </DataTable.Root>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading members");
    expect(screen.getAllByRole("row", { hidden: true })).toHaveLength(2);
    expect(screen.getAllByRole("cell", { hidden: true })).toHaveLength(2);
  });
});
