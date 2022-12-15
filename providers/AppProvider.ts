import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import cron from 'node-cron'
import Env from '@ioc:Adonis/Core/Env'
// import Moment from 'moment'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready

    // #feature: verify database here
  }

  public async ready () {
    // App is ready

    if (Env.get('ENABLE_CRON_XML')){
      // #region cron build xml single request
      const XmlContr = (await import('App/Controllers/Http/XmlsController')).default

      cron.schedule("*/10 * * * * *", async () => { //*/10 * * * * *

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

    if (Env.get('ENABLE_CRON_SURVEY')){
      // #region cron send survey
      const SurveyController = (await import('App/Controllers/Http/SurveyController')).default
      cron.schedule("*/1 * * * *", async () => {
        await new SurveyController().index()
      });
      // #endregion cron send survey
    }

    if (Env.get('ENABLE_CRON_EXP_SURVEY')){
      // #region cron survey expired
      const SurveyController = (await import('App/Controllers/Http/SurveyController')).default
      cron.schedule("*/30 * * * * *", async () => {
        await new SurveyController().expiration()
      });
      // #endregion cron send survey
    }

  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
