import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  static disableTransactions = true

  async up() {
    this.schema.raw(`
      CREATE UNIQUE INDEX CONCURRENTLY cards_checklist_number_unique
      ON cards (checklist_id, number)
    `)
    this.schema.raw(`
      CREATE UNIQUE INDEX CONCURRENTLY cards_base_card_variant_unique
      ON cards (base_card_id, variant)
      WHERE base_card_id IS NOT NULL
    `)
    this.schema.raw(`
      CREATE INDEX CONCURRENTLY cards_active_base_order_index
      ON cards (checklist_id, "order")
      WHERE variant IS NULL AND status <> 'archived'
    `)
  }

  async down() {
    this.schema.raw('DROP INDEX CONCURRENTLY IF EXISTS cards_active_base_order_index')
    this.schema.raw('DROP INDEX CONCURRENTLY IF EXISTS cards_base_card_variant_unique')
    this.schema.raw('DROP INDEX CONCURRENTLY IF EXISTS cards_checklist_number_unique')
  }
}
