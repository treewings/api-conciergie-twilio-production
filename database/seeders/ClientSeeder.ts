import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import Client from '../../app/Models/Client'

export default class ClientSeederSeeder extends BaseSeeder {
  public async run () {

    await Client.truncate(true)

    await Client.createMany([
      {
        description: 'Real Hospital Português',
        active: true,
        api_mv_token: 'ghjr4925ddrnnlpo56c6d5hj6d5b2e9aqz6494adadhjkghudsdf4d54mlo9kyrscnznx',
        api_mv_url: 'http://10.0.38.39/tascom/prd/tascomPanel/public/api/whatsapp',
        account_sid: 'ACef9560d79a5c474a55b134b9a5795049',
        auth_token: 'c359fc0b842beb2f800f9b0052664392',
        phone_number: '+12058968110',
        endpoint_request: 'https://api.umov.me/CenterWeb/api/32719ef041428895265d03b56bee3c15865d0d/schedule.xml',
        endpoint_request_itens: 'https://api.umov.me/CenterWeb/api/32719ef041428895265d03b56bee3c15865d0d/customEntity/alternativeIdentifier/cad_concierge_item/customEntityEntry.xml',
        active_send_request: true,
      },
    ])
  }
}
