import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import MenuModel from 'App/Models/Menu'
import MenuModel from '../Models/Menu'
import SubMenuModel from 'App/Models/SubMenu'

export default class MenusUtil {
  async insertMultiMenusForSetor({ params }: HttpContextContract) {

    const setores = [
      3
    ]

    for (let setor of setores) {

      let old_setor = params.old_setor
      let new_setor = setor
      let client_id = params.client_id

      const menu = await MenuModel
        .query()
        .where('setor', old_setor)
        .where('client_id', client_id)

      try {
        // let index = 0; index < menu.length; index++
        for (let element of menu) {

          let newMenuModel = new MenuModel()

          let {
            description,
            order,
            icon,
            type,
            message,
            active_type_attendance,
            client_id
          } = element

          newMenuModel.description = description
          newMenuModel.order = order
          newMenuModel.icon = icon
          newMenuModel.type = type
          newMenuModel.message = message
          newMenuModel.active_type_attendance = active_type_attendance
          newMenuModel.client_id = client_id
          newMenuModel.setor = new_setor

          let retMenu = await newMenuModel.save()

          if (newMenuModel.$isPersisted) {

            console.log(`Menu_id: ${retMenu.id}`)

            let submenu = await SubMenuModel
              .query()
              .where('menu_id', element.id)

            for (let elementSubMenu of submenu) {

              let newSubMenuModel = new SubMenuModel()

              let {
                description,
                order,
                time_attendance,
                type_attendance_id,
                active_quantity,
                min_quantity,
                max_quantity,
                group,
                activity,
                accept,
                team,
                service
              } = elementSubMenu

              newSubMenuModel.description = description,
                newSubMenuModel.order = order,
                newSubMenuModel.time_attendance = time_attendance,
                newSubMenuModel.type_attendance_id = type_attendance_id,
                newSubMenuModel.active_quantity = active_quantity,
                newSubMenuModel.min_quantity = min_quantity,
                newSubMenuModel.max_quantity = max_quantity,
                newSubMenuModel.group = group,
                newSubMenuModel.activity = activity,
                newSubMenuModel.accept = accept,
                newSubMenuModel.team = team,
                newSubMenuModel.service = service
              newSubMenuModel.menu_id = retMenu.id

              let retSubMenu = await newSubMenuModel.save()

              if (newSubMenuModel.$isPersisted) {
                console.log(`SubMenu_id: ${retSubMenu.id}`)
              }

            }

          }


        }

      } catch (error) {
        console.log(error)
      }

    }

    return true;
  }
}

module.exports = MenusUtil
