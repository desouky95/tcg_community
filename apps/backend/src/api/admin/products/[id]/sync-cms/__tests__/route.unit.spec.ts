import { POST } from '../route';
import { syncProductCmsWorkflow } from '../../../../../../workflows/sync-product-cms';
jest.mock('../../../../../../workflows/sync-product-cms', () => ({ syncProductCmsWorkflow: jest.fn() }));

describe('manual CMS sync route', () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  beforeEach(() => jest.clearAllMocks());
  it('runs the sync for the requested product and returns success', async () => {
    const run = jest.fn().mockResolvedValue({ result: { productId: 'prod_1' } });
    (syncProductCmsWorkflow as unknown as jest.Mock).mockReturnValue({ run });
    const scope = {};
    await POST({ params: { id: 'prod_1' }, scope } as any, res as any);
    expect(syncProductCmsWorkflow).toHaveBeenCalledWith(scope);
    expect(run).toHaveBeenCalledWith({ input: { productId: 'prod_1' } });
    expect(res.json).toHaveBeenCalledWith({ product_id: 'prod_1', synced: true });
  });
  it('does not report success when sync fails', async () => {
    (syncProductCmsWorkflow as unknown as jest.Mock).mockReturnValue({ run: jest.fn().mockRejectedValue(new Error('sync failed')) });
    await expect(POST({ params: { id: 'prod_1' }, scope: {} } as any, res as any)).rejects.toThrow('sync failed');
    expect(res.json).not.toHaveBeenCalled();
  });
});
