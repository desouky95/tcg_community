import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'checklists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('category_id').unsigned().references('categories.id').onDelete('CASCADE')
      table.integer('subcategory_id').unsigned().references('categories.id').onDelete('SET NULL')
      table.string('name').notNullable()
      table.string('type').notNullable().defaultTo('card')
      table.integer('year').notNullable()
      table.integer('total_cards').notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}