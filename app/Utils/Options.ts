import MenusController from 'App/Controllers/Http/MenusController'
import SubMenusController from 'App/Controllers/Http/SubMenusController'

import {
  IMainMenu,
  IPacAcomp,
  ISubMenus,
  ITypeAttendance,
  IMoreService,
  IConfirm
} from 'App/Controllers/Interfaces/IOptions'


export default class Options {
    async mainMenu(data: IMainMenu) {
      const retMenu = await new MenusController().showForId({
        menu_id: data.menu_id,
        setor: data.setor,
        client_id: data.client_id,
      })

      return retMenu != null ? retMenu : false
    }

    async subMenu(data: ISubMenus){

      if (data.submenu_id == null){
        return null
      }

      const retMenu = await new SubMenusController().showForId({
        menu_id: data.menu_id,
        submenu_id: data.submenu_id,
      })

      return retMenu
    }

    async pacAcomp(data: IPacAcomp) {
      return data.menu_id == 1 || data.menu_id == 2 ? true : false
    }

    async confirm(data: IConfirm) {
      return data.option == 1 || data.option == 2 ? true : false
    }

    async isTypeAttendance(data: ITypeAttendance) {

        const retMenu = await new MenusController().showForId({
          menu_id: data.menu_id,
          setor: data.setor,
          client_id: data.client_id,
        })
        if (retMenu != null){
          return retMenu.active_type_attendance ? true : false
        }
        return false
    }

    async verifyMenuType(data: {
      menu_id: number,
      client_id: number,
      setor: number
    }) {
      const retMenu = await new MenusController().showForId({
        menu_id: data.menu_id,
        setor: data.setor,
        client_id: data.client_id,
      })

      const retSubMenu = await new SubMenusController().showForId({
        menu_id: data.menu_id,
        submenu_id: 1,
      }) || {id: 0}


      if (retMenu) {
        return { 'type': retMenu.type, 'submenu_id': retSubMenu.id || 0 }
      }

      return { 'type': false, 'submenu_id': 0 }
    }

    async quantity(data: ISubMenus) {

      if (data.quantity == null){
        return false
      }

      const retMenu = await new SubMenusController().showForIdQuantity({
        submenu_id: data.submenu_id,
        menu_id: data.menu_id,
      })

      if (retMenu && (
          (data.quantity >= retMenu.min_quantity)
          &&
          (data.quantity <= retMenu.max_quantity)
        )){
          return true
        }else{
          return false
        }
    }

    async moreService(data: IMoreService) {
      return data.option == 1 || data.option == 2 ? true : false
    }
}

module.exports = Options
