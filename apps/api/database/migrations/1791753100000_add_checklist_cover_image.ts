import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    if (await this.schema.hasColumn('checklists', 'cover_image_path')) return
    this.schema.alterTable('checklists', (table) => {
      table.string('cover_image_path').nullable()
    })
  }

  async down() {
    if (!(await this.schema.hasColumn('checklists', 'cover_image_path'))) return
    this.schema.alterTable('checklists', (table) => {
      table.dropColumn('cover_image_path')
    })
  }
}
