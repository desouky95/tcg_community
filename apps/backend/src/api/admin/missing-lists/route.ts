import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createMissingListWorkflow } from "../../../workflows/missing-list"
import type { CreateMissingList } from "./validators"

export async function POST(req: AuthenticatedMedusaRequest<CreateMissingList>, res: MedusaResponse) {
  const { result } = await createMissingListWorkflow(req.scope).run({ input: req.validatedBody })
  res.status(201).json({ product: result })
}
