import { createStep, createWorkflow, StepResponse, transform, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { ContainerRegistrationKeys, MedusaError } from '@medusajs/framework/utils';
import { uploadFilesWorkflow, updateProductsWorkflow } from '@medusajs/medusa/core-flows';

type Input = { productId: string; filename: string; content: string };
const readProduct = createStep('read-avif-product', async (productId: string, { container }) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({ entity: 'product', fields: ['id', 'images.id', 'images.url'], filters: { id: productId } });
  if (!data.length) throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Product not found');
  return new StepResponse(data[0]);
});

export const uploadProductAvifWorkflow = createWorkflow('upload-product-avif', function (input: Input) {
  const product = readProduct(input.productId);
  const files = uploadFilesWorkflow.runAsStep({ input: { files: [{ filename: input.filename, content: input.content, mimeType: 'image/avif', access: 'public' }] } });
  const update = transform({ product, files }, ({ product, files }) => ({
    products: [{ id: product.id, images: [...(product.images ?? []).map((image) => ({ id: image.id, url: image.url })), { url: files[0].url }] }],
  }));
  const updated = updateProductsWorkflow.runAsStep({ input: update });
  return new WorkflowResponse(updated);
});
