import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { updateMissingListWorkflow } from "../../../../workflows/missing-list"
import type { UpdateMissingList } from "../validators"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({ entity: "product", fields: ["id", "title", "metadata", "variants.id", "variants.title", "variants.metadata", "variants.inventory_items.inventory.location_levels.location_id", "variants.inventory_items.inventory.location_levels.stocked_quantity"], filters: { id: req.params.id } })
  if (!data[0] || data[0].metadata?.type !== "missing_list") throw new MedusaError(MedusaError.Types.NOT_FOUND, "Missing-list product not found")
  const product: any = data[0]
  product.variants = product.variants.map((variant: any) => {
    const level = variant.inventory_items?.[0]?.inventory?.location_levels?.find((entry: any) => entry.location_id === product.metadata.location_id)
    return { ...variant, metadata: { ...variant.metadata, quantity: variant.metadata.active && level ? Number(level.stocked_quantity) : variant.metadata.quantity } }
  })
  res.json({ product })
}
export async function POST(req: AuthenticatedMedusaRequest<UpdateMissingList>, res: MedusaResponse) {
  await updateMissingListWorkflow(req.scope).run({ input: { ...req.validatedBody, product_id: req.params.id } })
  res.json({ success: true })
}
