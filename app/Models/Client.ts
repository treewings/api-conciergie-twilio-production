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
  public survey_expiration_time: string

  @column()
  public active_send_request: boolean

  @column()
  public alternative_identifier: string

  @column()
  public active_survey: boolean

  @column()
  public active_config_menu_survey_experience: boolean

  @column()
  public active_config_menu_survey_no_finished: boolean

  @column()
  public account_sid: string

  @column()
  public auth_token: string

  @column()
  public phone_number: string

  @column()
  public survey_min_experience: number

  @column()
  public survey_exp_activity: string

  @column()
  public survey_exp_service: string

  @column()
  public survey_exp_team: string

  @column()
  public survey_exp_accept: string

  @column()
  public survey_exp_group: string

  @column()
  public survey_exp_description: string

  @column()
  public survey_no_finished_activity: string

  @column()
  public survey_no_finished_service: string

  @column()
  public survey_no_finished_team: string

  @column()
  public survey_no_finished_accept: string

  @column()
  public survey_no_finished_group: string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
