import Application from '@ioc:Adonis/Core/Application'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class IndexSeeder extends BaseSeeder {

  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (seeder.default.developmentOnly && !Application.inDev) {
      return
    }

    await new seeder.default(this.client).run()
  }

  public async run () {
    await this.runSeeder(await import('../ClientSeeder'))
    await this.runSeeder(await import('../TypeAttendanceSeeder'))
    await this.runSeeder(await import('../StatusSeeder'))
    await this.runSeeder(await import('../MessageSeeder'))
    await this.runSeeder(await import('../MenuSeeder'))
    await this.runSeeder(await import('../SubMenuSeeder'))
    await this.runSeeder(await import('../TypeRequest'))
  }
}
