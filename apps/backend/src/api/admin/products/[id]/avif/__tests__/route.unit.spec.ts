import { POST } from '../route';
import { uploadProductAvifWorkflow } from '../../../../../../workflows/upload-product-avif';
jest.mock('../../../../../../workflows/upload-product-avif', () => ({ uploadProductAvifWorkflow: jest.fn() }));

describe('product AVIF route', () => {
  const buffer = Buffer.from('000000186674797061766966000000006d69663161766966', 'hex');
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  beforeEach(() => jest.clearAllMocks());
  it('uploads a valid file and returns the updated product', async () => {
    const run = jest.fn().mockResolvedValue({ result: [{ id: 'prod_1' }] });
    (uploadProductAvifWorkflow as unknown as jest.Mock).mockReturnValue({ run });
    const req = { params: { id: 'prod_1' }, scope: {}, file: { buffer, size: buffer.length, mimetype: 'image/avif', originalname: 'a.avif' } };
    await POST(req as any, res as any);
    expect(run).toHaveBeenCalledWith({ input: { productId: 'prod_1', filename: 'a.avif', content: buffer.toString('base64') } });
    expect(res.json).toHaveBeenCalledWith({ product: { id: 'prod_1' } });
  });
  it.each([undefined, { buffer, size: buffer.length, mimetype: 'image/png' }, { buffer: Buffer.from('bad'), size: 3, mimetype: 'image/avif' }, { buffer, size: 10485761, mimetype: 'image/avif' }])('rejects invalid files before upload', async (file) => {
    await expect(POST({ params: { id: 'p' }, file } as any, res as any)).rejects.toThrow('valid AVIF');
    expect(uploadProductAvifWorkflow).not.toHaveBeenCalled();
  });
});
