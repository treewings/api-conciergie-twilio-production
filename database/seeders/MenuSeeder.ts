import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import Menu from '../../app/Models/Menu'

export default class MenuSeederSeeder extends BaseSeeder {
  public async run () {

    await Menu.truncate(true)

    await Menu.createMany([
      {
        description: 'Site do hospital',
        icon: '',
        order: 1,
        setor: 50,
        client_id: 1,
        type: 'link',
        message: 'https://rhp.com.br/'
      },
      {
        description: 'Informações e regras da UTI',
        icon: '',
        order: 2,
        setor: 50,
        client_id: 1,
        type: 'link',
        message: 'https://rhp.com.br/'
      },
      {
        description: 'Conheça a unidade e seus profissionais',
        icon: '',
        order: 3,
        setor: 50,
        client_id: 1,
        type: 'link',
        message: 'https://rhp.com.br/'
      },
      {
        description: 'Chamado no leito',
        icon: '',
        order: 4,
        setor: 50,
        client_id: 1
      },
      {
        description: 'Enviar mensagem para supervisores da unidade',
        icon: '',
        order: 5,
        setor: 50,
        client_id: 1,
        type: 'link',
        message: 'https://rhp.com.br/'
      },
      {
        description: 'Copa/Nutrição',
        active_type_attendance: false,
        icon: '',
        order: 6,
        setor: 50,
        client_id: 1
      },
      {
        description: 'Higienização/limpeza',
        active_type_attendance: false,
        icon: '',
        order: 7,
        setor: 50,
        client_id: 1
      },
      {
        description: 'Enxoval',
        active_type_attendance: false,
        icon: '',
        order: 8,
        setor: 50,
        client_id: 1
      },
      {
        description: 'Pedir silencio no ambiente',
        active_type_attendance: false,
        icon: '',
        order: 9,
        setor: 50,
        client_id: 1,
        type: 'silencio_ambiente',
        message: 'Ok, pedido enviado\n'

      },
    ])
  }
}
