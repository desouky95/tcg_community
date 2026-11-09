import type { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { MedusaError } from '@medusajs/framework/utils';
import { uploadProductAvifWorkflow } from '../../../../../workflows/upload-product-avif';
import { isAvif, MAX_AVIF_BYTES } from './validation';

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const file = req.file;
  if (!file || file.size > MAX_AVIF_BYTES || file.mimetype !== 'image/avif' || !isAvif(file.buffer)) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Upload one valid AVIF image, up to 10 MB.');
  }
  const { result } = await uploadProductAvifWorkflow(req.scope).run({ input: { productId: req.params.id, filename: file.originalname, content: file.buffer.toString('base64') } });
  res.status(200).json({ product: result[0] });
}
