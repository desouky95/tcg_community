import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('user_checklists', (table) => {
      table.string('visibility', 16).notNullable().defaultTo('private')
      table.integer('version').notNullable().defaultTo(1)
      table.string('share_token', 64).nullable().unique()
    })
    this.schema.alterTable('user_checklist_cards', (table) => {
      table.integer('offered_quantity').notNullable().defaultTo(0)
      table.integer('wanted_quantity').notNullable().defaultTo(0)
    })
    this.schema.raw('UPDATE user_checklist_cards SET offered_quantity = GREATEST(quantity - 1, 0)')
    this.schema.raw(
      "ALTER TABLE user_checklists ADD CONSTRAINT user_checklists_visibility_check CHECK (visibility IN ('private', 'unlisted', 'public'))"
    )
    this.schema.raw(
      'ALTER TABLE user_checklist_cards ADD CONSTRAINT user_checklist_cards_quantities_check CHECK (quantity >= 0 AND offered_quantity >= 0 AND offered_quantity <= quantity AND wanted_quantity >= 0)'
    )
    this.schema.createTable('collection_audits', (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table.integer('checklist_id').unsigned().notNullable().references('id').inTable('checklists')
      table.string('action', 20).notNullable()
      table.integer('version').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.index(['user_id', 'checklist_id', 'created_at'])
    })
  }
  async down() {
    this.schema.dropTable('collection_audits')
    this.schema.raw(
      'ALTER TABLE user_checklist_cards DROP CONSTRAINT IF EXISTS user_checklist_cards_quantities_check'
    )
    this.schema.raw(
      'ALTER TABLE user_checklists DROP CONSTRAINT IF EXISTS user_checklists_visibility_check'
    )
    this.schema.alterTable('user_checklist_cards', (table) => {
      table.dropColumn('wanted_quantity')
      table.dropColumn('offered_quantity')
    })
    this.schema.alterTable('user_checklists', (table) => {
      table.dropColumn('share_token')
      table.dropColumn('version')
      table.dropColumn('visibility')
    })
  }
}
