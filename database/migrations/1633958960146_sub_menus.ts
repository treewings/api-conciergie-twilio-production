import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SubMenus extends BaseSchema {
  protected tableName = 'sub_menus'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('description')
      table.integer('order')
      table.integer('menu_id').unsigned().references('id').inTable('menus')
      table.integer('time_attendance').comment('Em minutos')
      table.integer('type_attendance_id').unsigned().references('id').inTable('type_attendances')
      table.boolean('active_quantity')
      table.integer('min_quantity').nullable()
      table.integer('max_quantity').nullable()
      table.string('group').comment('depara 3wings (grupo)')
      table.string('activity').comment('depara 3wings (atividade)')
      table.string('accept').comment('depara 3wings (aceitar)')
      table.string('team').comment('depara 3wings (time)')
      table.string('service').comment('depara 3wings (servico)')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
