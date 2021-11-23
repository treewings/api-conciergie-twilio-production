import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MenuModel from 'App/Models/Menu'

import { IMainMenu } from 'App/Controllers/Interfaces/IOptions'

export default class MenusController {
  public async index (client_id: number) {
    return await MenuModel
    .query()
    .where('client_id', client_id)
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, params}: HttpContextContract) {
    const {
      description,
      type,
      icon,
      message,
      setor,
      active_type_attendance,
    } = request.body()

    const client_id = params.client_id

    const order = await MenuModel.query()
    .where('client_id', client_id)
    .orderBy('order', 'desc')
    .first()

    let orderI = order == null ? 1 : order.order + 1

    const menus = new MenuModel()

    menus.description = description
    menus.order = orderI
    menus.type = type
    menus.icon = icon
    menus.message = message
    menus.setor = setor
    menus.active_type_attendance = active_type_attendance
    menus.client_id = client_id

    await menus.save()

    return menus.$isPersisted ? true : false

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
