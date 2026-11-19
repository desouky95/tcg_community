import type { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import {
  addToCartWorkflow,
  completeCartWorkflow,
  createCartWorkflow,
  updateLineItemInCartWorkflow,
} from "@medusajs/medusa/core-flows";

async function validateAvailability(
  items: { variant_id?: string | null }[],
  container: MedusaContainer,
) {
  const ids = [...new Set(items.map((item) => item.variant_id).filter((id): id is string => !!id))];
  if (!ids.length) return;
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "product.title", "product.type.value"],
    filters: { id: ids },
  });
  const blocked = variants.find((variant) => variant.product?.type?.value === "Coming Soon");
  if (blocked) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `${blocked.product?.title ?? "This product"} is coming soon and cannot be purchased yet. Remove it from your cart to continue.`,
    );
  }
}

addToCartWorkflow.hooks.validate(async ({ input }, { container }) => {
  await validateAvailability(input.items ?? [], container);
});

createCartWorkflow.hooks.validate(async ({ input }, { container }) => {
  await validateAvailability(input.items ?? [], container);
});

updateLineItemInCartWorkflow.hooks.validate(async ({ input, cart }, { container }) => {
  await validateAvailability(cart.items.filter((item: { id: string }) => item.id === input.item_id), container);
});

completeCartWorkflow.hooks.validate(async ({ cart }, { container }) => {
  // Read current product types: a product may have changed since it was added.
  await validateAvailability(cart.items ?? [], container);
});
