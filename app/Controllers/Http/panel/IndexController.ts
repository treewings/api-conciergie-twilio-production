// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import View from '@ioc:Adonis/Core/View'
//controllers
import ClientsController from 'App/Controllers/Http/ClientsController'
import MenusController from 'App/Controllers/Http/MenusController'
import SubMenusController from 'App/Controllers/Http/SubMenusController'

export default class IndexController {
  public async index(){

    const clients = await new ClientsController().index()

    return await View.render('panel/index', { clients})
  }

  public async clients(params){

    const client = await new ClientsController().show(params.id)

    return await View.render('panel/pages/config/client/index', { client })
  }

  public async menus(params){

    const menus = await new MenusController().index(params.id)
    const client = await new ClientsController().show(params.id)

    return await View.render('panel/pages/config/menus/index', { menus, client })
  }

  public async submenus(params){

    const submenus = await new SubMenusController().index(params.menu_id)
    const client = await new ClientsController().show(params.client_id)

    return await View.render('panel/pages/config/submenus/index', { submenus, client, menu_id: params.menu_id })
  }
}
