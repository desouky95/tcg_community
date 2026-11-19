import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createProductTypesWorkflow } from "@medusajs/medusa/core-flows";

export default async function seedProductAvailabilityTypes({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const values = ["Coming Soon", "Pre-order"];
  const { data: existing } = await query.graph({
    entity: "product_type",
    fields: ["value"],
    filters: { value: values },
  });
  const missing = values.filter((value) => !existing.some((type) => type.value === value));
  if (missing.length) {
    await createProductTypesWorkflow(container).run({
      input: { product_types: missing.map((value) => ({ value })) },
    });
  }
}
