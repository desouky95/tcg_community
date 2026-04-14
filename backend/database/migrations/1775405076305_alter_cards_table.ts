import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('need_count').defaultTo(0)
      table.integer('hold_count').defaultTo(0)
      table.integer('offer_count').defaultTo(0)
      table.decimal('ratio', 10, 2).defaultTo(0)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('need_count')
      table.dropColumn('hold_count')
      table.dropColumn('offer_count')
      table.dropColumn('ratio')
    })
  }
}