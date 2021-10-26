import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import TypeRequestModel from 'App/Models/TypeRequest'

export default class TypeRequestSeeder extends BaseSeeder {
  public async run () {
    await TypeRequestModel.truncate(true)

    await TypeRequestModel.createMany([
      {
        description: 'Single request',
      },
      {
        description: 'Single request items',
      },
    ])
  }
}
