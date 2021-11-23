import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import SubMenuModel from 'App/Models/SubMenu'

export default class SubMenuSeederSeeder extends BaseSeeder {
  public async run () {
    await SubMenuModel.truncate(true)

    await SubMenuModel.createMany([
      {
        description: 'Dor ou mal estar',
        menu_id: 4,
        order: 1,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Troca de fraldas / higiene do paciente',
        menu_id: 4,
        order: 2,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Troca de soro ou medicação',
        menu_id: 4,
        order: 3,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Movimentação no leito',
        menu_id: 4,
        order: 4,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Outras demandas',
        menu_id: 4,
        order: 5,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Alterar refeição recebida',
        menu_id: 6,
        order: 1,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Esquentar alimento',
        menu_id: 6,
        order: 2,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Solicitar limpeza',
        menu_id: 7,
        order: 1,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Recolher lixo',
        menu_id: 7,
        order: 2,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Kit Paciente (Lençol/Fronha/Toalha)',
        menu_id: 8,
        order: 1,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3
      },
      {
        description: 'Solicitar Lençol',
        menu_id: 8,
        order: 2,
        time_attendance: 30,
        active_quantity: true,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3,
        min_quantity: 1,
        max_quantity: 5,
      },
      {
        description: 'Pedir silencio no ambiente',
        menu_id: 9,
        order: 1,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3,
      },
      // santa catarina
      {
        description: 'Controle Remoto',
        menu_id: 10,
        order: 1,
        time_attendance: 30,
        active_quantity: false,
        group: 'grp_hotelaria',
        activity: 'atv_hote_controle',
        accept: 'atv_hote_aceitar',
        team: 'eqp_hotelaria',
        service: 'HOTE - Solicitação de Controle',
        type_attendance_id: 3,
      },
    ])
  }
}
