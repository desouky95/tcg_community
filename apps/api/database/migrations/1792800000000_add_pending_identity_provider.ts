import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('pending_external_identities', (table) => {
      table.string('provider').notNullable().defaultTo('facebook')
    })
  }

  async down() {
    this.schema.alterTable('pending_external_identities', (table) => table.dropColumn('provider'))
  }
}
