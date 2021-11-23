import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'

export default class ClientsController {
  public async index () {
    return await Client.all();
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request}: HttpContextContract) {
    const {
      endpoint_request,
      endpoint_request_itens,
      api_mv_url,
      api_mv_token,
      account_sid,
      auth_token,
      phone_number,
      active_send_request,
      description,
    } = request.body()

    const client = new Client()

    client.endpoint_request = endpoint_request
    client.endpoint_request_itens = endpoint_request_itens
    client.api_mv_url = api_mv_url
    client.api_mv_token = api_mv_token
    client.account_sid = account_sid
    client.auth_token = auth_token
    client.phone_number = phone_number
    client.active_send_request = active_send_request
    client.description = description

    client.save()

    return client.$isPersisted ? true : false

  }

  public async show (client_id: number) {
    return await Client.find(client_id);
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
