import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import RequestOutsModel from './RequestOut'

export default class Survey extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public avaliation: string

  @column()
  public comments: string

  @column()
  public active: boolean

  @belongsTo(() => RequestOutsModel, {
    foreignKey: "request_outs_id"
  })
  public request_outs: BelongsTo<typeof RequestOutsModel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
