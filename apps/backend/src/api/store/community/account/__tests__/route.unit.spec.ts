import { POST } from '../route'

jest.mock('@medusajs/medusa/core-flows', () => ({
  createCustomerAddressesWorkflow: jest.fn(), updateCustomerAddressesWorkflow: jest.fn(), deleteCustomerAddressesWorkflow: jest.fn(),
}))
const run = async (body: unknown, key = 'secret', addresses: unknown[] = []) => {
  const customers = { listCustomerAddresses: jest.fn().mockResolvedValue(addresses) }
  const orders = { listAndCountOrders: jest.fn().mockResolvedValue([[], 0]) }
  const req = { headers: { 'x-next-pull-service-key': key }, body, scope: { resolve: jest.fn((name: string) => name === 'customer' ? customers : orders) } }
  const res = { statusCode: 200, payload: undefined as unknown, status(code: number) { this.statusCode = code; return this }, json(payload: unknown) { this.payload = payload; return this } }
  await POST(req as never, res as never)
  return { res, customers, orders }
}
describe('private account bridge', () => {
  beforeEach(() => { process.env.NEXT_PULL_SERVICE_KEY = 'secret' })
  afterEach(() => { delete process.env.NEXT_PULL_SERVICE_KEY })
  it('rejects missing or invalid service credentials', async () => {
    expect((await run({ operation: 'addresses', customer_id: 'cus_a' }, 'wrong')).res.statusCode).toBe(401)
    delete process.env.NEXT_PULL_SERVICE_KEY
    expect((await run({ operation: 'addresses', customer_id: 'cus_a' })).res.statusCode).toBe(401)
  })
  it('scopes order queries to the resolved customer and returns 404 for a missing order', async () => {
    const { res, orders } = await run({ operation: 'order', customer_id: 'cus_a', id: 'order_b' })
    expect(res.statusCode).toBe(404)
    expect(orders.listAndCountOrders).toHaveBeenCalledWith(expect.objectContaining({ customer_id: 'cus_a', id: 'order_b' }), expect.anything())
  })
  it('refuses to mutate an address outside the customer scope', async () => {
    const { res, customers } = await run({ operation: 'delete_address', customer_id: 'cus_a', id: 'addr_b' })
    expect(res.statusCode).toBe(404)
    expect(customers.listCustomerAddresses).toHaveBeenCalledWith({ id: 'addr_b', customer_id: 'cus_a' }, expect.anything())
  })
  it('rejects invalid and unexpected input', async () => {
    expect((await run({ operation: 'create_address', customer_id: 'cus_a', address: { customer_id: 'cus_b' } })).res.statusCode).toBe(400)
  })
})
