import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import type { ICustomerModuleService, IOrderModuleService } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'
import { z } from '@medusajs/framework/zod'
import { createCustomerAddressesWorkflow, updateCustomerAddressesWorkflow, deleteCustomerAddressesWorkflow } from '@medusajs/medusa/core-flows'
import { timingSafeEqual } from 'node:crypto'

const field = z.string().trim().min(1).max(255)
const addressSchema = z.object({ first_name: field, last_name: field, address_1: field, address_2: z.string().trim().max(255).optional(), city: field, province: z.string().trim().max(255).optional(), postal_code: z.string().trim().max(32).optional(), country_code: z.string().trim().length(2), phone: z.string().trim().max(32).optional() }).strict()
const inputSchema = z.discriminatedUnion('operation', [
  z.object({ operation: z.literal('orders'), customer_id: field, offset: z.number().int().min(0).max(100000).default(0) }).strict(),
  z.object({ operation: z.literal('order'), customer_id: field, id: field }).strict(),
  z.object({ operation: z.literal('addresses'), customer_id: field }).strict(),
  z.object({ operation: z.literal('create_address'), customer_id: field, address: addressSchema }).strict(),
  z.object({ operation: z.literal('update_address'), customer_id: field, id: field, address: addressSchema }).strict(),
  z.object({ operation: z.literal('delete_address'), customer_id: field, id: field }).strict(),
])

function authorized(value: string | undefined) {
  const expected = process.env.NEXT_PULL_SERVICE_KEY
  if (!expected || !value) return false
  const a = Buffer.from(expected); const b = Buffer.from(value)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Private service endpoint. The caller determines customer_id from its authenticated session. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!authorized(req.headers['x-next-pull-service-key'] as string | undefined)) return res.status(401).json({ message: 'Unauthorized' })
  const parsed = inputSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ message: 'Invalid request' })
  const input = parsed.data
  const customer = req.scope.resolve(Modules.CUSTOMER) as ICustomerModuleService
  const orders = req.scope.resolve(Modules.ORDER) as IOrderModuleService
  if (input.operation === 'orders' || input.operation === 'order') {
    const [rows, count] = await orders.listAndCountOrders({ customer_id: input.customer_id, ...(input.operation === 'order' ? { id: input.id } : {}) }, { take: input.operation === 'order' ? 1 : 20, skip: input.operation === 'orders' ? input.offset : 0, order: { created_at: 'DESC' }, ...(input.operation === 'order' ? { relations: ['items'] } : {}) })
    const result = rows.map(order => ({ id: order.id, display_id: order.display_id, status: order.status, created_at: order.created_at, currency_code: order.currency_code, ...(input.operation === 'order' ? { items: (order.items ?? []).map(item => ({ id: item.id, title: item.title, quantity: item.quantity })) } : {}) }))
    if (input.operation === 'order') return result.length ? res.json({ order: result[0] }) : res.status(404).json({ message: 'Not found' })
    return res.json({ orders: result, count })
  }
  if (input.operation === 'addresses') {
    const rows = await customer.listCustomerAddresses({ customer_id: input.customer_id }, { take: 100 })
    return res.json({ addresses: rows.map(({ id, first_name, last_name, address_1, address_2, city, province, postal_code, country_code, phone }) => ({ id, first_name, last_name, address_1, address_2, city, province, postal_code, country_code, phone })) })
  }
  if (input.operation === 'create_address') {
    await createCustomerAddressesWorkflow(req.scope).run({ input: { addresses: [{ ...input.address, customer_id: input.customer_id }] } })
    return res.status(201).json({ ok: true })
  }
  const owned = await customer.listCustomerAddresses({ id: input.id, customer_id: input.customer_id }, { take: 1 })
  if (!owned.length) return res.status(404).json({ message: 'Not found' })
  if (input.operation === 'update_address') await updateCustomerAddressesWorkflow(req.scope).run({ input: { selector: { id: input.id, customer_id: input.customer_id }, update: input.address } })
  else await deleteCustomerAddressesWorkflow(req.scope).run({ input: { ids: [input.id] } })
  return res.json({ ok: true })
}
