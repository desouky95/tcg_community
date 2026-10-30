import Link from 'next/link'
import { Button, EmptyStatePanel } from '@tcg/ui-web'
import { listStoreProducts } from '../../../../src/lib/medusa.server'
import { CommerceCustomerLink } from './commerce-customer-link'

export const metadata = { title: 'Shop | Next Pull', description: 'Official Next Pull releases, fulfilled through our store.' }

export default async function ShopPage() {
  const products = await listStoreProducts()
  return (
    <section className="mx-auto max-w-360 px-gutter py-section">
      <CommerceCustomerLink />
      <div className="mb-10 max-w-2xl border-b-2 border-wax-ink pb-6"><p className="ui-kicker">OFFICIAL STORE</p><h1>New pulls, direct from Next Pull.</h1><p className="mt-4 text-wax-muted">Products, stock, carts, and orders are managed securely by our store.</p></div>
      {products === null ? <EmptyStatePanel title="The shop is being prepared." description="Configure Medusa Store API access to publish the official catalogue." action={<Button asChild><Link href="/checklists">Explore checklists</Link></Button>} /> : products.length === 0 ? <EmptyStatePanel title="No products are available yet." description="Check back for the next release." /> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.filter((product) => product.handle).map((product) => <Link key={product.id} href={`/shop/${product.handle}`} className="focus-ring border border-wax-line bg-card p-4 hover:border-accent-500"><div className="aspect-square bg-wax-paper">{product.thumbnail ? <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" /> : null}</div><h2 className="mt-4 text-xl">{product.title}</h2><p className="mt-2 line-clamp-2 text-sm text-wax-muted">{product.description}</p></Link>)}</div>}
    </section>
  )
}
