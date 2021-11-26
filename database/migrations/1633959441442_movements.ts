import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Movements extends BaseSchema {
  protected tableName = 'movements'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('number')
      table.string('nr_attendance')
      table.integer('status_movement_id').unsigned().references('id').inTable('status_movements')
      table.integer('menu_id').unsigned().references('id').inTable('menus')
      table.integer('sub_menu_id').unsigned().references('id').inTable('sub_menus').nullable()
      table.integer('client_id').unsigned().references('id').inTable('clients').nullable()
      table.boolean('active').defaultTo(true)
      table.string('quantity').nullable()
      table.integer('main_movement').nullable()
	  table.integer('type_attendance').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
