import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button, Container, Text } from "@medusajs/ui";
import { Link } from "react-router-dom";

const InventoryByProductWidget = () => {
  return (
    <Container className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      <Text size="small">
        Browse inventory items grouped under their products.
      </Text>
      <Button asChild size="small" variant="secondary">
        <Link to="/inventory-by-product">Group by product</Link>
      </Button>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "inventory_item.list.before",
});

export default InventoryByProductWidget;
