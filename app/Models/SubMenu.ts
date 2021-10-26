import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

//models
import Menu from './Menu'
import TypeAttendance from './TypeAttendance'

export default class SubMenu extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public order: number

  @column()
  public menu_id: number

  @hasMany(() => Menu, {
    foreignKey: 'menu_id',
  })
  public menu: HasMany<typeof Menu>

  @column()
  public time_attendance: number

  @column()
  public type_attendance_id: number | null

  @belongsTo(() => TypeAttendance, {
    foreignKey: 'type_attendance_id'
  })
  public type_attendance: BelongsTo<typeof TypeAttendance>

  @column()
  public active_quantity: boolean

  @column()
  public min_quantity: number

  @column()
  public max_quantity: number

  @column()
  public group: string

  @column()
  public activity: string

  @column()
  public accept: string

  @column()
  public team: string

  @column()
  public service: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
