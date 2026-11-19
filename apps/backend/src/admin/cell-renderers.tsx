import { defineCellRenderer } from "@medusajs/dashboard/lib";
import { Text } from "@medusajs/ui";
import { Link } from "react-router-dom";

type InventoryRow = {
  variants?: { product?: { id: string; title: string } | null }[];
};

defineCellRenderer("inventory_products", {
  truncateTooltip: false,
  render: (_value, row: InventoryRow) => {
    const products = new Map<string, { id: string; title: string }>();
    for (const variant of row.variants ?? []) {
      if (variant.product) products.set(variant.product.id, variant.product);
    }
    if (!products.size)
      return (
        <Text size="small" className="text-ui-fg-subtle">
          No linked product
        </Text>
      );
    return (
      <div className="flex flex-col gap-1 py-2">
        {[...products.values()].map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            onClick={(event) => event.stopPropagation()}
            className="text-ui-fg-interactive hover:underline"
          >
            <Text size="small">{product.title}</Text>
          </Link>
        ))}
      </div>
    );
  },
});
