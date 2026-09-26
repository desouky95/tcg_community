import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_checklists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('checklist_id').unsigned().references('id').inTable('checklists').onDelete('CASCADE')
      table.text('missing_list').nullable()
      table.text('duplicates_list').nullable()
      table.text('collected_list').nullable()
      table.unique(['user_id', 'checklist_id'])

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}