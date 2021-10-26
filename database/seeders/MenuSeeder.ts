import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import Menu from '../../app/Models/Menu'

export default class MenuSeederSeeder extends BaseSeeder {
  public async run () {

    await Menu.truncate(true)

    await Menu.createMany([
      {
        description: 'Serviço de Hotelaria',
        active_type_attendance: true,
        icon: 'hotelaria',
        order: 1,
        setor: 50,
        client_id: 1
      },
    ])
  }
}
