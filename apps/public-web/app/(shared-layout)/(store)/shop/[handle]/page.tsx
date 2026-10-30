import Link from 'next/link'
import { Button, EmptyStatePanel } from '@tcg/ui-web'
import { getStoreProduct } from '../../../../../src/lib/medusa.server'
import { CommerceCustomerLink } from '../commerce-customer-link'

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const product = await getStoreProduct(handle)
  if (!product) return <section className="mx-auto max-w-360 px-gutter py-section"><EmptyStatePanel title="Product unavailable" description="This release may have moved or sold out." action={<Button asChild><Link href="/shop">Back to shop</Link></Button>} /></section>
  return <section className="mx-auto grid max-w-360 gap-8 px-gutter py-section lg:grid-cols-2"><CommerceCustomerLink /><div className="aspect-square bg-wax-paper">{product.thumbnail ? <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" /> : null}</div><div><p className="ui-kicker">NEXT PULL STORE</p><h1>{product.title}</h1><p className="mt-5 max-w-xl text-wax-muted">{product.description}</p><p className="mt-8 text-sm text-wax-muted">Checkout is completed securely in the Next Pull store. Guest email is collected only for order updates.</p><Button asChild className="mt-6"><Link href="/shop">Browse all releases</Link></Button></div></section>
}
