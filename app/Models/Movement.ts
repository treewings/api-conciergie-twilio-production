import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

//models
import StatusMovement from './StatusMovement'
import Menu from './Menu'
import SubMenu from './SubMenu'
import Client from './Client'
import Survey from './Survey'

export default class Movement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public number: string

  @column()
  public nr_attendance: string | null

  @column()
  public status_movement_id: number

  @column()
  public main_movement: number | null

  @column()
  public type_attendance: number | null

  @column()
  public client_id: number

  @belongsTo(() => Client, {
    foreignKey: 'client_id',
  })
  public client: BelongsTo<typeof Client>

  @belongsTo(() => StatusMovement, {
    foreignKey: 'status_movement_id',
  })
  public status_movement: BelongsTo<typeof StatusMovement>

  @column()
  public menu_id: number | null

  @belongsTo(() => Menu, {
    foreignKey: 'menu_id',
  })
  public menu: BelongsTo<typeof Menu>

  @column()
  public sub_menu_id: number | null

  @belongsTo(() => SubMenu, {
    foreignKey: 'sub_menu_id',
  })
  public sub_menu: BelongsTo<typeof SubMenu>

  @column()
  public active: boolean

  @column()
  public survey_id: number | null

  @belongsTo(() => Survey, {
    foreignKey: 'survey_id',
  })
  public survey: BelongsTo<typeof Survey>

  @column()
  public quantity: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
