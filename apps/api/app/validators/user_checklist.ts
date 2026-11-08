import vine from '@vinejs/vine'
export const updateOrCreateUserChecklistValidator = vine.create({
  missingList: vine
    .string()
    .optional(),
  duplicatesList: vine
    .string()
    .optional(),
  collectedList: vine
    .string()
    .optional(),
})

export const importUpdateChecklist = vine.create({
  file: vine.file({
    extnames: ['xlsx', 'xls'],
    size: '5mb',
  }),
  treatEmptyAsMissing: vine.boolean().optional(),
})
