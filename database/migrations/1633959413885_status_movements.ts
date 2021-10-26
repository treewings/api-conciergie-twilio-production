import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StatusMovements extends BaseSchema {
  protected tableName = 'status_movements'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('cd_status_movement')
      table.string('description')
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
