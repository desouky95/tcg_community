import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { Modules } from '@medusajs/framework/utils'
import { timingSafeEqual } from 'node:crypto'

type CustomerInput = {
  external_id?: string
  email?: string
  first_name?: string
  last_name?: string
}

function hasValidServiceKey(value: string | undefined) {
  const expected = process.env.NEXT_PULL_SERVICE_KEY
  if (!expected || !value) return false
  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(value)
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer)
}

/** Private, idempotent bridge used only by the Adonis identity service. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!hasValidServiceKey(req.headers['x-next-pull-service-key'] as string | undefined)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const input = req.body as CustomerInput
  if (!input.external_id) return res.status(400).json({ message: 'external_id is required' })

  const customerService = req.scope.resolve(Modules.CUSTOMER) as {
    listCustomers: (filters: Record<string, unknown>) => Promise<Array<{ id: string }>>
    createCustomers: (data: Record<string, unknown>) => Promise<{ id: string }>
    updateCustomers: (id: string, data: Record<string, unknown>) => Promise<{ id: string }>
  }
  const [existing] = await customerService.listCustomers({ metadata: { next_pull_user_id: input.external_id } })
  const metadata = { next_pull_user_id: input.external_id }
  const customer = existing
    ? await customerService.updateCustomers(existing.id, { email: input.email, first_name: input.first_name, last_name: input.last_name, metadata })
    : await customerService.createCustomers({ email: input.email, first_name: input.first_name, last_name: input.last_name, metadata })

  return res.status(existing ? 200 : 201).json({ customer: { id: customer.id } })
}
