import { Checkbox, Input, Label, Text } from '@medusajs/ui'
import type { DraftCard } from './csv'

type Props = { cards: DraftCard[]; errors: string[]; onChange: (cards: DraftCard[]) => void; editableIdentity?: boolean }
export function CardEditor({ cards, errors, onChange, editableIdentity = false }: Props) {
  function update(index: number, patch: Partial<DraftCard>) { onChange(cards.map((card, i) => i === index ? { ...card, ...patch } : card)) }
  return <div className="grid gap-3">{cards.map((card, i) => <div key={card.key} className="grid gap-2 rounded-md border border-ui-border-base p-3">
    <Text weight="plus">Card {i + 1}{!editableIdentity && `: ${card.number} — ${card.name}`}</Text>
    {editableIdentity && <div className="grid gap-2 sm:grid-cols-2"><Label>Number<Input aria-label={`Number for card ${i + 1}`} value={card.number} onChange={e => update(i, { number: e.target.value })} /></Label><Label>Name<Input aria-label={`Name for card ${i + 1}`} value={card.name} onChange={e => update(i, { name: e.target.value })} /></Label></div>}
    <div className="grid gap-2 sm:grid-cols-3"><Label>Price (EGP)<Input aria-label={`Price for card ${i + 1}`} type="number" min="0.01" step="0.01" value={card.price} onChange={e => update(i, { price: e.target.value })} /></Label><Label>Quantity<Input aria-label={`Quantity for card ${i + 1}`} type="number" min="0" step="1" value={card.quantity} onChange={e => update(i, { quantity: e.target.value })} /></Label><label className="flex items-center gap-2"><Checkbox checked={card.active} onCheckedChange={v => update(i, { active: v === true })} /> Active</label></div>
    {errors[i] && <Text className="text-ui-fg-error" role="alert">{errors[i]}</Text>}
  </div>)}</div>
}
