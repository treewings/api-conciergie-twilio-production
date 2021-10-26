import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Menus extends BaseSchema {
  protected tableName = 'menus'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('description')
      table.integer('order')
      table.string('icon').nullable()
      table.boolean('active_type_attendance').comment('Se é um menu que tens submenus exclusivamente destinado para o paciente ou acompanhante')
      table.integer('setor').nullable()
      table.integer('client_id').unsigned().references('id').inTable('clients')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
