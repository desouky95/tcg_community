import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('variant').nullable()
      table.integer('base_card_id').unsigned().nullable().references('cards.id').onDelete('CASCADE')
    })

    this.schema.raw(`
      ALTER TABLE cards
      ADD CONSTRAINT cards_variant_shape_check
      CHECK (
        (variant IS NULL AND base_card_id IS NULL)
        OR (variant IS NOT NULL AND base_card_id IS NOT NULL AND btrim(variant) <> '')
      )
    `)
    this.schema.raw(`
      ALTER TABLE cards
      ADD CONSTRAINT cards_base_card_not_self_check
      CHECK (base_card_id IS NULL OR base_card_id <> id)
    `)
  }

  async down() {
    this.schema.raw('ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_base_card_not_self_check')
    this.schema.raw('ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_variant_shape_check')
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('base_card_id')
      table.dropColumn('base_card_id')
      table.dropColumn('variant')
    })
  }
}
