import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).nullable().unique()
      table.string('username', 50).notNullable().unique()
      table.string('mobile', 20).notNullable().unique()
      table.string('password').nullable()
      table.string('role').notNullable().defaultTo('user')
      table.integer('points').notNullable().defaultTo(0)
      table.boolean('blocked').notNullable().defaultTo(false)
      table.boolean('is_verified').notNullable().defaultTo(false)
      table.string('otp_code').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
