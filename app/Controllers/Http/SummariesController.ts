//models
import MovementsModel from "App/Models/Movement";
import Database from '@ioc:Adonis/Lucid/Database'

// interfaces
import { ISummary, ISummaryItens } from 'App/Controllers/Interfaces/IMovement'

export default class SummariesController {
  public async show (data: ISummary) {

    return MovementsModel
    .query()
    .where('status_movement_id', 7)
    .whereNotNull('menu_id')
    .whereNotNull('sub_menu_id')
    .where('main_movement', data.main_movement)
    .where('client_id', data.client_id)
    .where('number', data.number)
    .where('nr_attendance', data.nr_attendance)
    .preload('menu')
    .preload('sub_menu')
    .orderBy('menu_id');
  }

  public async showForRequest (data: ISummary) {

    return await Database
    .rawQuery(`
    select
      activity,
      group_concat(CONCAT(' ', description , quantity)) description,
      group_concat(id) branches_movement,
      group_concat(serviceIsPatient) serviceIsPatient,
      sum(qtd) sum_qtd,
      grupo,
      accept,
      team,
      service,
      main_movement
    from (
      select
          sub_menus.description,
          sub_menus.activity,
          sub_menus.group as grupo,
          sub_menus.accept,
          sub_menus.team,
          sub_menus.service,
          movements.main_movement as main_movement,
          movements.id,
          if(movements.quantity is null, 1, movements.quantity) as qtd,
		  if(sub_menus.type_attendance_id = 2, 'Não', 'Sim') serviceIsPatient,
          if(movements.quantity is null, ' (1)', concat(' (', movements.quantity, ')')) as quantity
        from movements, menus, sub_menus
        where
        movements.status_movement_id = 7
        and movements.main_movement = ${data.main_movement}
        and movements.client_id =  ${data.client_id}
        and movements.number = ${data.number}
        and movements.nr_attendance = ${data.nr_attendance}
        and menus.id = movements.menu_id
        and sub_menus.id = movements.sub_menu_id
      ) as table1
    group by activity,
    grupo,
    accept,
    team,
    service,
    main_movement
  `)

  }

  public async showForRequestItens (data: ISummaryItens) {

    return await Database
    .rawQuery(`
    select
    sub_menus.description,
    sub_menus.id submenu_id,
    movements.main_movement as main_movement,
    movements.nr_attendance,
    if(movements.quantity is null, 1, movements.quantity) as quantity
    from movements, menus, sub_menus
    where
    movements.status_movement_id = 7
    and movements.main_movement = ${data.main_movement}
    and movements.client_id =  ${data.client_id}
    and movements.number = ${data.number}
    and movements.nr_attendance = ${data.nr_attendance}
    and movements.id in (${data.branches_movement})
    and menus.id = movements.menu_id
    and sub_menus.id = movements.sub_menu_id
  `)

  }

}
