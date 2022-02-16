import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public endpoint_request: string

  @column()
  public company_id: number

  @column()
  public endpoint_request_itens: string

  @column()
  public api_mv_url: string

  @column()
  public api_mv_token: string

  @column()
  public active: boolean

  @column()
  public active_send_request: boolean

  @column()
  public account_sid: string

  @column()
  public auth_token: string

  @column()
  public phone_number: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
