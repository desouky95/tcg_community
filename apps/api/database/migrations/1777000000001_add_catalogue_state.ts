import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'catalogue_imports'

  async up() {
    this.schema.alterTable('categories', (table) => {
      table.string('status').notNullable().defaultTo('published')
      table.integer('version').notNullable().defaultTo(1)
    })
    this.schema.alterTable('checklists', (table) => {
      table.string('status').notNullable().defaultTo('published')
      table.integer('version').notNullable().defaultTo(1)
    })
    this.schema.alterTable('cards', (table) => {
      table.string('status').notNullable().defaultTo('published')
      table.integer('version').notNullable().defaultTo(1)
    })
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('actor_id').nullable().references('users.id').onDelete('SET NULL')
      table.string('checksum').notNullable().unique()
      table.string('status').notNullable().defaultTo('validated')
      table.text('summary').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.alterTable('cards', (table) => {
      table.dropColumn('status')
      table.dropColumn('version')
    })
    this.schema.alterTable('checklists', (table) => {
      table.dropColumn('status')
      table.dropColumn('version')
    })
    this.schema.alterTable('categories', (table) => {
      table.dropColumn('status')
      table.dropColumn('version')
    })
  }
}
