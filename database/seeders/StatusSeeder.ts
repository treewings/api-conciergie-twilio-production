import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import StatusMovement from 'App/Models/StatusMovement'

export default class StatusSeederSeeder extends BaseSeeder {
  public async run () {

    await StatusMovement.truncate(true)

    await StatusMovement.createMany([
      {
        cd_status_movement: 'waiting',
        description: 'Esperando o usuario mandar código do atendimento mv',
      },
      {
        cd_status_movement: 'lobby',
        description: 'Esperando o usuario decidir o menu principal',
      },
      {
        cd_status_movement: 'menu',
        description: 'Esperando o usuario decidir o submenu ou pac_acomp',
      },
      {
        cd_status_movement: 'pac_acomp',
        description: 'Esperando o usuario decidir o se pac ou acomp',
      },
      {
        cd_status_movement: 'submenu',
        description: 'esperando o usuario decidir o Submenu',
      },
      {
        cd_status_movement: 'quantity',
        description: 'esperando o usuario decidir a Quantidade',
      },
      {
        cd_status_movement: 'more_service',
        description: 'esperando o usuario decidir se quer mais serviços',
      },
      {
        cd_status_movement: 'confirm',
        description: 'esperando o usuario decidir se quer confirmar ou cancelar o pedido',
      },
      {
        cd_status_movement: 'end_service',
        description: 'usuario confirmou ou cancelou o pedido',
      },
    ])
  }
}
