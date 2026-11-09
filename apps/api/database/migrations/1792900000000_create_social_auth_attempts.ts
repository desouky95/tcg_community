import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('social_auth_attempts', (table) => {
      table.increments('id')
      table.string('nonce_hash', 64).notNullable().unique()
      table.string('provider').notNullable()
      table.string('destination').notNullable()
      table.text('return_to').notNullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('consumed_at').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })
  }
  async down() {
    this.schema.dropTable('social_auth_attempts')
  }
}
