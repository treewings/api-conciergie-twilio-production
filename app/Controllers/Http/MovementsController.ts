import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { IMovementStore, IMovementShow } from 'App/Controllers/Interfaces/IMovement'
//models
import MovementModel from 'App/Models/Movement'
import StatusMovementModel from 'App/Models/StatusMovement'
import SubMenuModel from 'App/Models/SubMenu'
import MenuModel from 'App/Models/Menu'


export default class MovementsController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({}: HttpContextContract) {
  }

  public async store (data: IMovementStore) {

    const StatusMovement = await StatusMovementModel.findBy('cd_status_movement', data.status_movement_code)

    if (!StatusMovement){
      return false;
    }

    const movement = new MovementModel()

    movement.number             = data.number
    movement.nr_attendance      = data.nr_attendance
    movement.status_movement_id = StatusMovement.id
    movement.quantity           = data.quantity
    movement.client_id          = data.client_id
    movement.main_movement      = (data.status_movement_code == 'lobby' && data.keep_main_movement == null || false) ? data.last_movement : data.main_movement
    movement.main_movement      = data.status_movement_code == 'waiting' ? null : movement.main_movement

    if (data.status_movement_code == 'menu' && !data.more_service){

      if (data.menu_id == null){
        return false
      }

      const retMenu = await MenuModel
      .query()
      .where('order', data.menu_id)
      .where('client_id', data.client_id)
      .first()

      if (retMenu){
        movement.menu_id = retMenu.id
      }

    }else{
      movement.menu_id = data.menu_id
      movement.sub_menu_id = data.submenu_id
    }

    if (data.status_movement_code == 'submenu' || data.status_movement_code == 'quantity'){

      if (data.submenu_id == null || data.menu_id == null){
        return false
      }

      const retSubMenu =
      await SubMenuModel
      .query()
      .where('order', data.submenu_id)
      .where('menu_id', data.menu_id)
      .first()

      if (retSubMenu){
        movement.sub_menu_id = retSubMenu.id
      }

    }else{
      movement.menu_id = data.menu_id
      movement.sub_menu_id = data.submenu_id
    }

    if (data.status_movement_code == 'end_service'){
      movement.active = false
    }

    let retSave = await movement.save()

    if (retSave){
      const upd = await this.update(data.last_movement)

      if (upd && data.status_movement_code == 'end_service'){
        const movementInit = new MovementModel()
        const StatusMovementInit = await StatusMovementModel.findBy('cd_status_movement', 'lobby')

        if (!StatusMovementInit){
          return false
        }

        movementInit.number             = data.number
        movementInit.nr_attendance      = data.nr_attendance
        movementInit.status_movement_id = StatusMovementInit.id
        movementInit.quantity           = null
        movementInit.client_id          = data.client_id
        movementInit.main_movement      = null

        await movementInit.save()
      }

    }


    return movement.$isPersisted ? true : false;

  }

  public async show (data: IMovementShow) {

    const ret = await MovementModel
    .query()
    .where(data.column, data.value)
    .where('active', true)
    .where('client_id', data.client_id)
    .preload('status_movement')
    .first()

    return ret === null ? false : ret;
  }

  public async showMovMenusDefault (data: IMovementShow) {

    const ret = await MovementModel
    .query()
    .where('status_movement_id', 7)
    .where(data.column, data.value)
    .whereNotNull('menu_id')

    return ret[0] ? true : false;
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update (last_movement: number | null) {
    if (last_movement){
      const movement = await MovementModel.findOrFail(last_movement)

      movement.active = false;
      const ret = await movement.save()

      return ret ? true : false
    }

  }

  public async destroy ({}: HttpContextContract) {
  }
}
