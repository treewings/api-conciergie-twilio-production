import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MenuModel from 'App/Models/Menu'
import SubMenuModel from 'App/Models/SubMenu'

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

  public async repeatMenusSector () {
	  // ja cadastrado o setor 23 sepaco
     const setores = [
       1,8,18,24,25,26,31,33,37,38,39,40,47,48,49,52,99,100,105,113,114,115,118,121,124,125, 129, 130, 163, 167, 169, 170, 171, 172, 174, 178, 179, 181, 182, 199,216, 226, 233, 234, 237, 238, 239, 240, 242, 268, 270, 271, 277, 278, 279, 280, 281, 282, 283, 330, 342,343, 364, 365, 367
     ]

    for (let index = 0; index < setores.length; index++) {
      const data: any = {
        client_id: 6,
        sector_id: 23,
        new_sector: setores[index]
      }

      await this.replicMenusFromSector(data)

    }

  }

  public async replicMenusFromSector (data: { client_id: number, sector_id: number, new_sector: number }){

    const menuData = await MenuModel.query()
    .where('client_id', data.client_id).where('setor', data.sector_id)
    if (!menuData) return

    for (let iMenu = 0; iMenu < menuData.length; iMenu++) {
      const menus = new MenuModel()
      menus.description = menuData[iMenu].description
      menus.order = menuData[iMenu].order
      menus.type = menuData[iMenu].type
      menus.icon = menuData[iMenu].icon
      menus.active_type_attendance = menuData[iMenu].active_type_attendance
      menus.setor = data.new_sector
      menus.message = menuData[iMenu].message
      menus.client_id = data.client_id
      await menus.save()
      console.log(`menu cadastrado: ${menus.id}`)

      if (menus.$isPersisted){
        const subMenuData = await SubMenuModel.query().where('menu_id', menuData[iMenu].id)
        for (let iSubMenu = 0; iSubMenu < subMenuData.length; iSubMenu++) {
          const subMenus = new SubMenuModel()
          subMenus.menu_id = menus.id
          subMenus.description = subMenuData[iSubMenu].description
          subMenus.order = subMenuData[iSubMenu].order
          subMenus.time_attendance = subMenuData[iSubMenu].time_attendance
          subMenus.type_attendance_id = subMenuData[iSubMenu].type_attendance_id
          subMenus.active_quantity = subMenuData[iSubMenu].active_quantity
          subMenus.min_quantity = subMenuData[iSubMenu].min_quantity
          subMenus.max_quantity = subMenuData[iSubMenu].max_quantity
          subMenus.group = subMenuData[iSubMenu].group
          subMenus.activity = subMenuData[iSubMenu].activity
          subMenus.accept = subMenuData[iSubMenu].accept
          subMenus.team = subMenuData[iSubMenu].team
          subMenus.service = subMenuData[iSubMenu].service
          await subMenus.save()
          console.log(`submenu cadastrado: ${subMenus.id}`)
        }

      }


    }



  }
}
