import handler from '../sync-strapi-product';
import { strapiClient, syncProduct } from '../../integrations/strapi/product-sync';
jest.mock('../../integrations/strapi/product-sync', () => ({ strapiClient: jest.fn(), syncProduct: jest.fn() }));
const logger = { error: jest.fn() };
const graph = jest.fn();
const container = { resolve: (name: string) => name === 'query' ? { graph } : logger } as any;
beforeEach(() => { jest.resetAllMocks(); process.env.STRAPI_SYNC_URL = 'http://cms.test'; process.env.STRAPI_SYNC_TOKEN = 'token'; });
afterEach(() => { delete process.env.STRAPI_SYNC_URL; delete process.env.STRAPI_SYNC_TOKEN; });
test('product creation including missing lists synchronizes product ID', async () => {
  await handler({ event: { name: 'product.created', data: { id: 'p1' } }, container } as any);
  expect(syncProduct).toHaveBeenCalledWith('p1', container);
});
test('deleted variant falls back to its existing CMS association', async () => {
  graph.mockResolvedValue({ data: [] });
  (strapiClient as jest.Mock).mockReturnValue({ find: jest.fn().mockResolvedValue([{ product: { medusaId: 'p1' } }]) });
  await handler({ event: { name: 'product-variant.deleted', data: { id: 'v1' } }, container } as any);
  expect(graph).toHaveBeenCalledWith(expect.objectContaining({ withDeleted: true }));
  expect(syncProduct).toHaveBeenCalledWith('p1', container);
});
test('propagates failure so the event bus can retry without logging credentials', async () => {
  (syncProduct as jest.Mock).mockRejectedValue(new Error('secret'));
  await expect(handler({ event: { name: 'product.updated', data: { id: 'p1' } }, container } as any)).rejects.toThrow('Strapi product sync failed for p1');
  expect(logger.error).not.toHaveBeenCalledWith(expect.stringContaining('secret'));
});
