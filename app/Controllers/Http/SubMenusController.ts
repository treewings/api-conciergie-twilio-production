import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubMenuModel from 'App/Models/SubMenu'
import {ISubMenus} from 'App/Controllers/Interfaces/IOptions'

export default class SubMenusController {
  public async index (menu_id: number) {
    return await SubMenuModel
    .query()
    .where('menu_id', menu_id)
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, params}: HttpContextContract) {
    const {
      description,
      time_attendance,
      type_attendance_id,
      active_quantity,
      min_quantity,
      max_quantity,
      group,
      activity,
      accept,
      team,
      service,
    } = request.body()

    const menu_id = params.menu_id

    const order = await SubMenuModel.query()
    .where('menu_id', menu_id)
    .orderBy('order', 'desc')
    .first()

    let orderI = order == null ? 1 : order.order + 1

    const submenus = new SubMenuModel()

    submenus.description = description
    submenus.order = orderI
    submenus.time_attendance = time_attendance
    submenus.type_attendance_id = type_attendance_id
    submenus.active_quantity = active_quantity
    submenus.min_quantity = min_quantity
    submenus.max_quantity = max_quantity
    submenus.group = group
    submenus.activity = activity
    submenus.accept = accept
    submenus.team = team
    submenus.service = service
    submenus.menu_id = menu_id


    await submenus.save()

    return submenus.$isPersisted ? true : false

  }

  public async show (data: ISubMenus) {

    if (data.type_attendance_id == null){
      return null
    }

    return await SubMenuModel
    .query()
    .where('menu_id', data.menu_id)
    .whereIn('type_attendance_id', [data.type_attendance_id, 3])
  }

  public async showForId (data: ISubMenus) {

    const ret = await SubMenuModel
    .query()
    .where('menu_id', data.menu_id)
    .where('order', data.submenu_id)
    .first();

    return ret;

  }

  public async showForIdQuantity (data: ISubMenus) {

    return await SubMenuModel
    .find(data.submenu_id)

  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
