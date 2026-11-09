import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('external_identities', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('provider').notNullable()
      table.string('provider_subject').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.unique(['provider', 'provider_subject'])
      table.unique(['provider', 'user_id'])
    })
    this.schema.createTable('pending_external_identities', (table) => {
      table.increments('id')
      table.string('binding_hash', 64).notNullable().unique()
      table.string('provider_subject').notNullable()
      table.string('email').nullable()
      table.text('return_to').notNullable()
      table.json('signup_data').nullable()
      table.string('signup_mobile', 20).nullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
    })
  }
  async down() {
    this.schema.dropTable('pending_external_identities')
    this.schema.dropTable('external_identities')
  }
}
