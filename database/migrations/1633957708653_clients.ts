import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clients extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('description')
      table.string('endpoint_request')
      table.string('endpoint_request_itens')
      table.string('api_mv_url')
      table.string('api_mv_token')
      table.string('account_sid')
      table.string('auth_token')
      table.string('phone_number')
      table.boolean('active')
      table.boolean('active_send_request')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
