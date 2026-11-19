import { Button, Container, Heading, Input, Label, Text, toast } from '@medusajs/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sdk } from '../../../lib/client'
import { CardEditor } from '../components/card-editor'
import { cardErrors, parseUpdateCsv, serializeUpdateCsv, type DraftCard } from '../components/csv'

type Product = { id: string; title: string; variants: { id: string; metadata: { card_number: string; card_name: string; price: number; quantity: number; active: boolean } }[] }
const ManageMissingListPage = () => {
  const { id } = useParams(); const client = useQueryClient(); const [draft, setDraft] = useState<DraftCard[] | null>(null); const [importError, setImportError] = useState('')
  const product = useQuery({ queryKey: ['missing-list', id], enabled: !!id, queryFn: () => sdk.client.fetch<{ product: Product }>(`/admin/missing-lists/${id}`) })
  const original = product.data?.product.variants.map(v => ({ key: v.id, id: v.id, number: v.metadata.card_number, name: v.metadata.card_name, price: String(v.metadata.price), quantity: String(v.metadata.quantity), active: v.metadata.active })) ?? []
  const cards = draft ?? original
  const changed = cards.filter(c => { const previous = original.find(v => v.id === c.id); return !previous || Number(c.price) !== Number(previous.price) || Number(c.quantity) !== Number(previous.quantity) || c.active !== previous.active })
  const errors = cardErrors(cards, '', true)
  const save = useMutation({ mutationFn: () => sdk.client.fetch(`/admin/missing-lists/${id}`, { method: 'POST', body: { cards: changed.map(c => ({ id: c.id, price: Number(c.price), quantity: Number(c.quantity), active: c.active })) } }), onSuccess: async () => { await client.invalidateQueries({ queryKey: ['missing-list', id] }); setDraft(null); toast.success('Cards updated') }, onError: e => toast.error(e.message) })
  function downloadCsv() {
    const url = URL.createObjectURL(new Blob([serializeUpdateCsv(original)], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${product.data?.product.title || 'missing-list'}-cards.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  if (product.isLoading) return <Container><Text>Loading cards…</Text></Container>
  if (product.error) return <Container><Text role="alert">{product.error.message}</Text></Container>
  return <Container className="grid gap-4 p-6"><Link to="/missing-list">← Missing List</Link><Heading>{product.data?.product.title}</Heading><Text>Manage prices, stock and availability for this product.</Text><div className="flex flex-wrap gap-3"><Button variant="secondary" onClick={downloadCsv}>Download CSV</Button><div className="grid gap-1"><Label htmlFor="variant-csv">Import updated CSV</Label><Input id="variant-csv" type="file" accept=".csv,text/csv" onChange={async event => { setImportError(''); const input = event.currentTarget; const file = input.files?.[0]; if (!file) return; try { setDraft(parseUpdateCsv(await file.text(), original)) } catch (error) { setImportError(error instanceof Error ? error.message : 'Unable to read CSV') } finally { input.value = '' } }} /></div></div>{importError && <Text role="alert" className="text-ui-fg-error">{importError}</Text>}<CardEditor cards={cards} errors={errors} onChange={setDraft} /><Button isLoading={save.isPending} disabled={!draft || !changed.length || save.isPending || errors.some(Boolean)} onClick={() => save.mutate()}>Save changes</Button></Container>
}

export default ManageMissingListPage
