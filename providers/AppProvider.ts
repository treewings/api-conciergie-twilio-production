import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import cron from 'node-cron'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    // App is ready

    // #region cron build xml single request
    const XmlContr = (await import('App/Controllers/Http/XmlsController')).default
      cron.schedule("*/10 * * * * *", async () => {
        await new XmlContr().BuildXmlSingleRequest()
        await new XmlContr().BuildXmlSingleRequestItens()
      });
    // #endregion cron build xml single request

    // #region cron send xml single request and build single request itens
      cron.schedule("*/3 * * * * *", async () => {
        await new XmlContr().send()
      });
    // #endregion cron send xml single request and build single request itens
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
