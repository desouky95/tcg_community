export type StoreProduct = {
  id: string
  title: string
  handle: string | null
  description: string | null
  thumbnail: string | null
}

const backendUrl = process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

function headers() {
  return publishableKey ? { 'x-publishable-api-key': publishableKey } : undefined
}

/** Reads Medusa's Store API only. Product/catalogue state never enters Adonis. */
export async function listStoreProducts(): Promise<StoreProduct[] | null> {
  if (!backendUrl || !publishableKey) return null
  const response = await fetch(`${backendUrl.replace(/\/$/, '')}/store/products?limit=24&fields=id,title,handle,description,thumbnail`, {
    headers: headers(),
    next: { revalidate: 60 },
  })
  if (!response.ok) throw new Error(`Medusa Store API returned ${response.status}`)
  const payload = (await response.json()) as { products?: StoreProduct[] }
  return payload.products ?? []
}

export async function getStoreProduct(handle: string): Promise<StoreProduct | null> {
  const products = await listStoreProducts()
  return products?.find((product) => product.handle === handle) ?? null
}
