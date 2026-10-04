import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'checklists'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('slug').unique()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {})
  }
}
