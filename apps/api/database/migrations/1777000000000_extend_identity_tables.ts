import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('status').notNullable().defaultTo('active')
      table.string('locale', 10).notNullable().defaultTo('en')
      table.string('theme', 20).notNullable().defaultTo('system')
      table.text('privacy_preferences').nullable()
      table.text('communication_preferences').nullable()
      table.integer('version').notNullable().defaultTo(1)
      table.timestamp('deactivated_at', { useTz: true }).nullable()
      table.timestamp('anonymized_at', { useTz: true }).nullable()
    })

    this.schema.createTable('otp_challenges', (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('mobile', 20).notNullable()
      table.string('purpose', 32).notNullable()
      table.string('code_hash').notNullable()
      table.integer('attempts').notNullable().defaultTo(0)
      table.integer('max_attempts').notNullable().defaultTo(5)
      table.timestamp('expires_at', { useTz: true }).notNullable()
      table.timestamp('consumed_at', { useTz: true }).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.index(['mobile', 'purpose', 'expires_at'])
    })

    this.schema.createTable('identity_idempotency_keys', (table) => {
      table.increments('id').notNullable()
      table.string('key', 160).notNullable().unique()
      table.string('scope', 100).notNullable()
      table.string('fingerprint', 128).notNullable()
      table.integer('status').notNullable()
      table.text('response_json').notNullable()
      table.timestamp('expires_at', { useTz: true }).notNullable()
      table.timestamp('created_at').notNullable()
      table.index(['scope', 'expires_at'])
    })

    this.schema.createTable('privacy_exports', (table) => {
      table.increments('id').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('status', 20).notNullable().defaultTo('queued')
      table.string('download_token', 128).nullable()
      table.timestamp('expires_at', { useTz: true }).notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.index(['user_id', 'status'])
    })
  }

  async down() {
    this.schema.dropTable('privacy_exports')
    this.schema.dropTable('identity_idempotency_keys')
    this.schema.dropTable('otp_challenges')
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
      table.dropColumn('locale')
      table.dropColumn('theme')
      table.dropColumn('privacy_preferences')
      table.dropColumn('communication_preferences')
      table.dropColumn('version')
      table.dropColumn('deactivated_at')
      table.dropColumn('anonymized_at')
    })
  }
}
