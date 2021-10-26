import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubMenuModel from 'App/Models/SubMenu'
import {ISubMenus} from 'App/Controllers/Interfaces/IOptions'

export default class SubMenusController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
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

    return await SubMenuModel
    .query()
    .where('menu_id', data.menu_id)
    .where('order', data.submenu_id)
    .first()

  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
