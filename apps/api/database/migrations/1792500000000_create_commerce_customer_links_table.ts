import { BaseSchema } from '@adonisjs/lucid/schema'

/** Links a Next Pull identity to the corresponding Medusa customer without
 * duplicating credentials or sharing databases. */
export default class extends BaseSchema {
  protected tableName = 'commerce_customer_links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().unique().references('id').inTable('users').onDelete('CASCADE')
      table.string('medusa_customer_id').nullable().unique()
      table.string('status').notNullable().defaultTo('active')
      table.integer('sync_attempts').notNullable().defaultTo(0)
      table.text('last_sync_error').nullable()
      table.timestamp('last_synced_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
