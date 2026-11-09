import type { SubscriberArgs, SubscriberConfig } from '@medusajs/framework';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { strapiClient, syncProduct } from '../integrations/strapi/product-sync';

export default async function syncStrapiProduct({ event, container }: SubscriberArgs<{ id: string } | { id: string }[]>) {
  const entries = Array.isArray(event.data) ? event.data : [event.data];
  for (const item of entries) {
    if (!item?.id) continue;
    let productId: string | undefined;
    if (event.name.startsWith('product-variant.')) {
      const query = container.resolve(ContainerRegistrationKeys.QUERY);
      const { data } = await query.graph({ entity: 'product_variant', fields: ['product_id'], filters: { id: item.id }, withDeleted: true });
      productId = data[0]?.product_id ?? undefined;
      if (!productId) {
        const url = process.env.STRAPI_SYNC_URL; const token = process.env.STRAPI_SYNC_TOKEN;
        if (!url || !token) throw new Error('Strapi synchronization is not configured');
        const variants = await strapiClient(url, token).find('product-variants', 'medusaId', item.id, true);
        productId = variants[0]?.product?.medusaId;
      }
    } else productId = item.id;
    if (!productId) continue;
    try { await syncProduct(productId, container); }
    catch { container.resolve('logger').error(`Strapi product sync failed for ${productId}; event will be retried`); throw new Error(`Strapi product sync failed for ${productId}`); }
  }
}
export const config: SubscriberConfig = { event: ['product.created', 'product.updated', 'product-variant.created', 'product-variant.updated', 'product-variant.deleted'], context: { subscriberId: 'sync-strapi-product' } };
