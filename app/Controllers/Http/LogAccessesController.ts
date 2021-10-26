import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

//models
import LogAccess from 'App/Models/LogAccess'

export default class LogAccessesController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({}: HttpContextContract) {
  }

  public async store (data) {
    let retData = await LogAccess.create(data)
    return retData ? true : false
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
