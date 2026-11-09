import type { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { syncProductCmsWorkflow } from '../../../../../workflows/sync-product-cms';

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { result } = await syncProductCmsWorkflow(req.scope).run({ input: { productId: req.params.id } });
  res.status(200).json({ product_id: result.productId, synced: true });
}
