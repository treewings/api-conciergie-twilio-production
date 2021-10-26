import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import TypeAttendanceModel from 'App/Models/TypeAttendance'

export default class TypeAttendanceSeederSeeder extends BaseSeeder {
  public async run () {
    await TypeAttendanceModel.truncate(true)

    await TypeAttendanceModel.createMany([
      {
        description: 'Patient',
      },
      {
        description: 'Companion',
      },
      {
        description: 'All',
      },
    ])
  }
}
