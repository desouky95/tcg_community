import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'swap_deals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('conversation_id')
        .unsigned()
        .references('id')
        .inTable('conversations')
        .onDelete('CASCADE')
      table
        .integer('created_by_user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')

      table
        .enum('status', [
          'pending',
          'accepted',
          'in_progress',
          'shipping',
          'completed',
          'cancelled',
        ])
        .defaultTo('pending')
      table.enum('swap_type', ['in_person', 'postal']).notNullable()

      table.text('offered_cards').notNullable() // comma separated
      table.text('requested_cards').notNullable() // comma separated

      // In-person tracking
      table.boolean('user1_qr_scanned').defaultTo(false)
      table.boolean('user2_qr_scanned').defaultTo(false)

      // Postal tracking
      table.string('user1_photo_url').nullable()
      table.string('user2_photo_url').nullable()
      table.string('user1_tracking').nullable()
      table.string('user2_tracking').nullable()
      table.boolean('user1_received').defaultTo(false)
      table.boolean('user2_received').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
