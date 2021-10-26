import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

//models
import Movement from './Movement'
import TypeRequest from './TypeRequest'

export default class RequestOut extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public number: string

  @column()
  public nr_attendance: string

  @column()
  public movement_id: number

  @belongsTo(() => Movement, {
    foreignKey: 'movement_id'
  })
  public movements: BelongsTo<typeof Movement>

  @column()
  public content: string

  @column()
  public return_content: string

  @column()
  public status_code: string

  @column()
  public error: string

  @column()
  public type_request_id: number

  @column()
  public waiting_send: boolean

  @column()
  public branches_movement: string

  @belongsTo(() => TypeRequest, {
    foreignKey: "type_request_id"
  })
  public type_requests: BelongsTo<typeof TypeRequest>

  @column()
  public movements_id_itens: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
