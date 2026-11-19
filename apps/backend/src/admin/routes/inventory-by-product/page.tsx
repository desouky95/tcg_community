import { defineRouteConfig } from "@medusajs/admin-sdk";
import type { HttpTypes } from "@medusajs/framework/types";
import {
  Button,
  Container,
  Heading,
  Input,
  Skeleton,
  Table,
  Text,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { sdk } from "../../lib/client";

const PAGE_SIZE = 10;

const  ProductInventory = ({ product }: { product: HttpTypes.AdminProduct }) => {
  const items = new Map<
    string,
    { inventory: HttpTypes.AdminInventoryItem; variants: Set<string> }
  >();
  for (const variant of product.variants ?? []) {
    for (const link of variant.inventory_items ?? []) {
      if (!link.inventory) continue;
      const item = items.get(link.inventory.id) ?? {
        inventory: link.inventory,
        variants: new Set<string>(),
      };
      item.variants.add(variant.title || variant.id);
      items.set(link.inventory.id, item);
    }
  }

  return (
    <section className="border-t border-ui-border-base">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h2" id={product.id}>
            <Link to={`/products/${product.id}`} className="hover:underline">
              {product.title}
            </Link>
          </Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {items.size} inventory items
          </Text>
        </div>
        <Button asChild size="small" variant="secondary">
          <Link to={`/products/${product.id}`}>View product</Link>
        </Button>
      </div>
      {!items.size ? (
        <Text size="small" className="px-6 pb-4 text-ui-fg-subtle">
          No linked inventory items. Check the product’s variant inventory
          settings.
        </Text>
      ) : (
        <div
          className="max-h-96 overflow-auto"
          role="region"
          aria-labelledby={product.id}
          tabIndex={0}
        >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Inventory item</Table.HeaderCell>
                <Table.HeaderCell>SKU</Table.HeaderCell>
                <Table.HeaderCell>Variants</Table.HeaderCell>
                <Table.HeaderCell className="text-right">
                  Stocked
                </Table.HeaderCell>
                <Table.HeaderCell className="text-right">
                  Reserved
                </Table.HeaderCell>
                <Table.HeaderCell className="text-right">
                  Available
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {[...items.values()].map(({ inventory, variants }) => {
                const levels = inventory.location_levels;
                const stocked = levels?.reduce(
                  (total, level) => total + Number(level.stocked_quantity),
                  0,
                );
                const reserved = levels?.reduce(
                  (total, level) => total + Number(level.reserved_quantity),
                  0,
                );
                return (
                  <Table.Row key={inventory.id}>
                    <Table.Cell>
                      <Link
                        to={`/inventory/${inventory.id}`}
                        className="text-ui-fg-interactive hover:underline"
                      >
                        {inventory.title || inventory.sku || inventory.id}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>{inventory.sku || "—"}</Table.Cell>
                    <Table.Cell>{[...variants].join(", ")}</Table.Cell>
                    <Table.Cell className="text-right tabular-nums">
                      {stocked ?? "—"}
                    </Table.Cell>
                    <Table.Cell className="text-right tabular-nums">
                      {reserved ?? "—"}
                    </Table.Cell>
                    <Table.Cell className="text-right tabular-nums">
                      {stocked != null && reserved != null
                        ? stocked - reserved
                        : "—"}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      )}
    </section>
  );
}

const   InventoryByProductPage =() => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ["inventory-by-product", search, page],
    queryFn: () =>
      sdk.admin.product.list({
        q: search || undefined,
        offset: page * PAGE_SIZE,
        limit: PAGE_SIZE,
        order: "title",
        fields:
          "id,title,variants.id,variants.title,*variants.inventory_items.inventory,*variants.inventory_items.inventory.location_levels",
      }),
  });

  return (
    <Container className="divide-y p-0">
      <div className="space-y-4 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Heading level="h1">Inventory by product</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              Stock across all locations, grouped by product. Shared inventory
              appears once per product; quantities are not product totals.
            </Text>
          </div>
          <div className="flex gap-2">
            <Button
              size="small"
              variant="secondary"
              disabled={isFetching}
              onClick={() => void refetch()}
            >
              Refresh
            </Button>
            <Button size="small" variant="secondary" asChild>
              <Link to="/inventory">All inventory items</Link>
            </Button>
          </div>
        </div>
        <Input
          aria-label="Search products"
          placeholder="Search products"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
        />
        <Text size="small" className="text-ui-fg-subtle">
          Items not linked to a product remain in All inventory items. Open an
          inventory item to edit stock.
        </Text>
      </div>
      {isPending ? (
        <div
          className="px-6 py-4"
          role="status"
          aria-label="Loading product inventory"
        >
          <Skeleton className="h-32" />
        </div>
      ) : error ? (
        <div className="space-y-3 px-6 py-4" role="alert">
          <Text>Could not load product inventory. Please try again.</Text>
          <Button
            size="small"
            variant="secondary"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        data && (
          <>
            {!data.products.length && (
              <Text className="px-6 py-4">
                No products found. Try another search.
              </Text>
            )}
            {data.products.map((product) => (
              <ProductInventory key={product.id} product={product} />
            ))}
            <Table.Pagination
              count={data.count}
              pageSize={PAGE_SIZE}
              pageIndex={page}
              pageCount={Math.ceil(data.count / PAGE_SIZE)}
              canPreviousPage={page > 0}
              canNextPage={(page + 1) * PAGE_SIZE < data.count}
              previousPage={() => setPage(page - 1)}
              nextPage={() => setPage(page + 1)}
            />
          </>
        )
      )}
    </Container>
  );
}

export const config = defineRouteConfig({ label: "Inventory by product" });
export const handle = { breadcrumb: () => "Inventory by product" };
export default InventoryByProductPage