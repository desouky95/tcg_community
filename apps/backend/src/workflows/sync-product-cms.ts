import { createStep, createWorkflow, StepResponse, WorkflowResponse } from '@medusajs/framework/workflows-sdk';
import { ContainerRegistrationKeys, MedusaError } from '@medusajs/framework/utils';
import { syncProduct } from '../integrations/strapi/product-sync';

const syncCmsProduct = createStep('sync-cms-product', async (productId: string, { container }) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({ entity: 'product', fields: ['id'], filters: { id: productId } });
  if (!data.length) throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Product not found');
  try { await syncProduct(productId, container); }
  catch {
    container.resolve(ContainerRegistrationKeys.LOGGER).error(`Manual CMS sync failed for product ${productId}`);
    throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, 'CMS sync failed. Check the product and CMS configuration, then try again.');
  }
  return new StepResponse({ productId });
});
export const syncProductCmsWorkflow = createWorkflow('sync-product-cms', function (input: { productId: string }) {
  const result = syncCmsProduct(input.productId);
  return new WorkflowResponse(result);
});
