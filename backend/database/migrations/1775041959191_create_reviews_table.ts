import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('reviewer_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('target_user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.enum('type', ['positive', 'negative']).notNullable()
      table.text('comment').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}