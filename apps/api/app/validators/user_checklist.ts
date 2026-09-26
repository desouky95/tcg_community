import vine from '@vinejs/vine'

const transform = (value: string, cards: string[]) => {
  const submittedCards = value.split(',')
  const validCards = submittedCards.map((_) =>
    cards.find((c) => c.toLowerCase() === _.toLowerCase())
  )
  return validCards.join(',') as string
}
export const updateOrCreateUserChecklistValidator = vine.create({
  missingList: vine
    .string()
    .optional()
    .transform((value, field) => {
      return transform(value, field.meta.cards)
    }),
  duplicatesList: vine
    .string()
    .optional()
    .transform((value, field) => {
      return transform(value, field.meta.cards)
    }),
  collectedList: vine
    .string()
    .optional()
    .transform((value, field) => {
      return transform(value, field.meta.cards)
    }),
})

export const importUpdateChecklist = vine.create({
  file: vine.file({
    extnames: ['xlsx', 'xls'],
    size: '5mb',
  }),
  treatEmptyAsMissing: vine.boolean().optional(),
})
