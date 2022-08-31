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

  @column()
  public survey_activity: string

  @column()
  public survey_service: string

  @column()
  public survey_team: string

  @column()
  public survey_accept: string

  @column()
  public survey_group: string

  @column()
  public survey_description_xml: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
