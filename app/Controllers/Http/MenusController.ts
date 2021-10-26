import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MenuModel from 'App/Models/Menu'

import { IMainMenu } from 'App/Controllers/Interfaces/IOptions'

export default class MenusController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show (data: IMainMenu) {
    return await MenuModel
    .query()
    .where('setor', data.setor)
    .where('client_id', data.client_id)
  }

  public async showForId (data: IMainMenu) {
    return await MenuModel
    .query()
    .where('setor', data.setor)
    .where('client_id', data.client_id)
    .where('order', data.menu_id || 0)
    .first()

  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
