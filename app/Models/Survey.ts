import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import RequestOutsModel from './RequestOut'

export default class Survey extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public intention: string

  @column()
  public experience: string

  @column()
  public comments: string

  @column()
  public request_integration: string

  @column()
  public response_integration: string

  @column()
  public contact_at: string

  @column()
  public active: boolean

  @column()
  public request_outs_id: boolean

  @belongsTo(() => RequestOutsModel, {
    foreignKey: "request_outs_id"
  })
  public request_outs: BelongsTo<typeof RequestOutsModel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
