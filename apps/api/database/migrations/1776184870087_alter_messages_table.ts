import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('type').defaultTo('text') // text, deal
      table
        .integer('deal_id')
        .unsigned()
        .references('id')
        .inTable('swap_deals')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {})
  }
}
