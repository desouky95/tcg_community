import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createRequire } from 'node:module'
import { z } from 'zod'
import { apiGet } from './api.js'
import { browserLogin } from './login.js'

const Medusa = createRequire(import.meta.url)('@medusajs/js-sdk').default
const server = new McpServer({ name: 'tcg-catalogues', version: '1.0.0' })
const medusa = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL ?? 'http://localhost:9000',
  publishableKey: process.env.MEDUSA_PUBLISHABLE_KEY,
})
const id = z.string().trim().min(1).max(200)
const pagination = { limit: z.number().int().min(1).max(100).default(20), offset: z.number().int().min(0).default(0) }
const result = async (operation: () => Promise<unknown>) => {
  try { return { content: [{ type: 'text' as const, text: JSON.stringify(await operation()) }] } }
  catch (error) {
    const message = error instanceof Error && (error.message.startsWith('TCG API ') || error.message.startsWith('API session ') || error.message.startsWith('A login page ')) ? error.message : 'Request failed. Check the service connection and configuration.'
    return { content: [{ type: 'text' as const, text: message }], isError: true }
  }
}

server.registerTool('browser_login', { description: 'Open a private local browser page to sign in to the TCG API. Session lasts until this server exits.', inputSchema: {} }, () => result(browserLogin))
server.registerTool('list_tcg_categories', { description: 'List TCG catalogue categories.', inputSchema: {} }, () => result(() => apiGet('categories')))
server.registerTool('search_checklists', { description: 'Find TCG checklists by name or category slug. Requires browser login.', inputSchema: { q: z.string().max(200).optional(), category: z.string().max(200).optional() } }, ({ q, category }) => result(() => apiGet('checklists', { q, category })))
server.registerTool('get_checklist', { description: 'Get a TCG checklist by ID or slug. Requires browser login.', inputSchema: { id } }, ({ id }) => result(() => apiGet(`checklists/${encodeURIComponent(id)}`)))
server.registerTool('list_checklist_cards', { description: 'List cards for a checklist by ID or slug. Requires browser login; results follow the account’s collection access.', inputSchema: { id } }, ({ id }) => result(() => apiGet(`checklists/${encodeURIComponent(id)}/cards`)))
server.registerTool('list_store_collections', { description: 'List store collections.', inputSchema: pagination }, (query) => result(() => medusa.store.collection.list(query)))
server.registerTool('list_store_categories', { description: 'List store product categories.', inputSchema: pagination }, (query) => result(() => medusa.store.category.list(query)))
const region = process.env.MEDUSA_REGION_ID?.trim()
const fields = region ? '+description,*variants.calculated_price,+variants.inventory_quantity,*images' : '+description,+variants.inventory_quantity,*images'
server.registerTool('search_store_products', { description: 'Search store products. Prices require MEDUSA_REGION_ID.', inputSchema: { ...pagination, q: z.string().max(200).optional() } }, ({ q, ...page }) => result(() => medusa.store.product.list({ ...page, ...(q ? { q } : {}), ...(region ? { region_id: region } : {}), fields })))
server.registerTool('get_store_product', { description: 'Find a store product by ID or handle. Prices require MEDUSA_REGION_ID.', inputSchema: { id } }, ({ id }) => result(async () => {
  const query = id.startsWith('prod_') ? { id: [id] } : { handle: [id] }
  const response = await medusa.store.product.list({ ...query, limit: 1, ...(region ? { region_id: region } : {}), fields })
  return response.products[0] ?? null
}))

await server.connect(new StdioServerTransport())
