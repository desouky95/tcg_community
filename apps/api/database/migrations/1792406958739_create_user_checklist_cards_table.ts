import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_checklist_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_checklist_id').references('user_checklists.id').onDelete('CASCADE')
      table.integer('card_id').references('cards.id').onDelete('CASCADE')
      table.integer('checklist_id').references('checklists.id').onDelete('CASCADE')
      table.integer('quantity').notNullable().defaultTo(0)
      table.unique(['user_checklist_id', 'card_id'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
