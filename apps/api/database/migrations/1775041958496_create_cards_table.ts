import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('checklist_id').unsigned().references('checklists.id').onDelete('CASCADE')
      table.string('number').notNullable()
      table.string('name').notNullable()
      table.string('type').nullable()
      table.string('section').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}