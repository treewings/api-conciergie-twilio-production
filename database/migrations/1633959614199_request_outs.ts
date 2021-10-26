import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RequestOuts extends BaseSchema {
  protected tableName = 'request_outs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('number')
      table.string('nr_attendance')
      table.integer('movement_id').unsigned().references('id').inTable('movements')
      table.json('content')
      table.string('return_content').nullable()
      table.integer('type_request_id').unsigned().references('id').inTable('type_requests')
      table.string('branches_movement').nullable()
      table.string('status_code').nullable()
      table.boolean('waiting_send').defaultTo(false)
      table.string('error').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
