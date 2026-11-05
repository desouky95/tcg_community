import { defineRouteConfig } from '@medusajs/admin-sdk'
import { Button, Container, Heading, Text } from '@medusajs/ui'
import { ListCheckbox } from '@medusajs/icons'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sdk } from '../../lib/client'

const MissingListProductPage = () => {
  const [page, setPage] = useState(0)
  const products = useQuery({ queryKey: ['missing-list-products', page], queryFn: () => sdk.admin.product.list({ limit: 50, offset: page * 50, fields: 'id,title,metadata' }) })
  return <Container className="grid gap-4 p-6"><Heading level="h1">Missing list products</Heading><div className="flex gap-3"><Link to="/missing-list/external"><Button size="small">Create from collection</Button></Link><Link to="/missing-list/import"><Button size="small" variant="secondary">Import CSV</Button></Link></div>
    <Heading level="h2">Manage products</Heading>
    {products.isLoading ? <Text>Loading products…</Text> : products.error ? <Text role="alert">{products.error.message}</Text> : <><div className="grid gap-2">{products.data?.products.filter(p => p.metadata?.type === 'missing_list').map(p => <Link key={p.id} to={`/missing-list/${p.id}`} className="text-ui-fg-interactive">{p.title}</Link>)}</div><div className="flex items-center gap-3"><Button size="small" variant="secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button><Text>Product page {page + 1}</Text><Button size="small" variant="secondary" disabled={(page + 1) * 50 >= (products.data?.count ?? 0)} onClick={() => setPage(page + 1)}>Next</Button></div><Text size="small" className="text-ui-fg-subtle">Pages contain all products; only missing lists are shown.</Text></>}
  </Container>
}
export const config = defineRouteConfig({ label: 'Missing List Product', icon: ListCheckbox })
export default MissingListProductPage
