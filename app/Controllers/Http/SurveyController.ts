import Day from 'dayjs'

//Controllers
import MovementsController from './MovementsController'
import XmlController from 'App/Controllers/Http/XmlsController'

//Models
import SubMenuModel from 'App/Models/SubMenu'
import ClientsModel from 'App/Models/Client'
import SurveyModel from 'App/Models/Survey'
import MovementsModel from 'App/Models/Movement'

//utils
import UmovMeUtil from 'App/Utils/umovMe'
import ApiService from 'App/Services/Api'
import TwilioResponse from 'App/Utils/TwilioResponse'
import Log from 'App/Utils/logs'

//interfaces
import { IMessage } from 'App/Controllers/Interfaces/IMessages'

export default class SurveyController {
  public async index () {
    try {
      const surveyData = await SurveyModel.query()
      .whereNull('contact_at')
      .preload('request_outs')
      .orderBy('updated_at') // orderBy, for balance in contacts
      .first();
      if (!surveyData) return false

      // get client data
      const clientData = await MovementsModel.query()
      .where('main_movement', surveyData.request_outs.movement_id)
      .where('status_movement_id', 9)
      .preload('client').first();
      if (!clientData) return false

      // if the task has been completed
      const retUmov = await new UmovMeUtil().searchTaskWithStatusEnd({
        url_base: clientData.client.endpoint_request,
        taskId: surveyData.request_outs.return_content
      })

      if (!retUmov) return false
      const movementData =
        await MovementsModel.query()
        .where('number', surveyData.request_outs.number)
        .whereNotNull('nr_attendance')
        .where('client_id', clientData.client_id)
        .orderBy('id', 'desc')

      // if in attendance for bot
      if (!movementData) return false
      const dataStoreMovemwent = movementData.find(e => e.active == true)
      if (dataStoreMovemwent) return false

      console.log(`Iniciando pesquisa, atendimento: ${clientData.nr_attendance}`)

      // add movement for survey
      await new MovementsController().store({
        number: surveyData.request_outs.number,
        nr_attendance: clientData.nr_attendance,
        status_movement_code: 'survey_init',
        menu_id: null,
        submenu_id: null,
        quantity: null,
        main_movement: null,
        type_attendance: null,
        last_movement: null,
        keep_main_movement: false,
        client_id: clientData.client_id,
        more_service: false,
        survey_id: surveyData.id
      })

      const returnMovementCreated = await MovementsModel.query()
      .where('active', true)
      .where('status_movement_id', 10)
      .where('number', surveyData.request_outs.number)
      .where('client_id', clientData.client_id)
      .first();

      if (!returnMovementCreated) return false
      surveyData.contact_at = Day().format()
      surveyData.movement_id = returnMovementCreated.id
      surveyData.save()


      // Get submenu infos
      const submenuData = await SubMenuModel
      .query()
      .where('menu_id', clientData.menu_id || 0)
      .where('id', clientData.sub_menu_id || 0)
      .first();

      if (!submenuData) return false

      // twilio message
      const returnTwilio =
        await new TwilioResponse().create({
          accountSid: clientData.client.account_sid,
          authToken: clientData.client.auth_token,
          from: clientData.client.phone_number,
          to: surveyData.request_outs.number,
          message: `Olá, gostaríamos de conhecer a sua opinião sobre o serviço solicitado: ${submenuData.description} - ${surveyData.request_outs.return_content}, gostaria de deixar a sua a avaliação?`
        })
      if (!returnTwilio) return false

      return true;

    } catch (error) {
      console.log(error)
    }


  }

  public async process (data: IMessage){

    // get datas, movement and survey
    const movementData = await MovementsModel.find(data.main_movement)
    if (!movementData) {
      Log.error(`No movementData found, data: ${JSON.stringify(data)}`)
      return `error`
    }

    const surveyData = await SurveyModel.find(movementData.survey_id)
    if (!surveyData) {
      Log.error(`No surveyData found, movementData: ${JSON.stringify(movementData)}`)
      return `error`
    }

    // case stop survey
    if (
      data.body.toUpperCase() == 'SAIR' ||
      data.body.toUpperCase() == 'PARAR'||
      data.body.toUpperCase() == '0'
      ){
        movementData.active = false
        movementData.save()

        surveyData.intention = 'stop'
        surveyData.save()

        Log.info(`Survey: ${surveyData.id} -> Intention: stop`)
        return 'survey_cancel'
    }

    if (data.cd_message == 'survey_init'){
      if (data.body.toUpperCase() == 'SIM'){
        // CONTINUE HERE

      }else if (data.body.toUpperCase() == 'NÃO' || data.body.toUpperCase() == 'NAO'){

        movementData.active = false
        movementData.save()

        surveyData.intention = 'negative'
        surveyData.save()

        Log.info(`Survey: ${surveyData.id} -> Intention: negative`)
        return 'survey_cancel'

      }else if (data.body.toUpperCase() == 'AINDA NÃO ATENDIDO' || data.body.toUpperCase() == 'AINDA NAO ATENDIDO'){
        // abrir a solicitacao no umovMe
        const clientData = await ClientsModel.find(data.client_id)
        if (!clientData) return 'error'

        let activity: any = []
        activity.push({alternativeIdentifier: clientData.survey_activity,})
        activity.push({alternativeIdentifier: clientData.survey_accept,})

        let contentJson =
        {
          schedule: {
            image: {
              id: 2294429,
              description: 'icon32',
              mediaType: 1,
              publicUrl: 'https://api.umov.me/CenterWeb/media/show/2294429?1535638692540',
              status: 2,
            },
            serviceLocal: {
              alternativeIdentifier: null
            },
            team:{
              alternativeIdentifier: clientData.survey_team
            },
            activitiesOrigin: 4,
            teamExecution: 1,
            date: Day().format('YYYY-MM-DD'),
            hour: Day().format('HH:mm'),
            activityRelationship: {activity},
            observation: clientData.survey_service,
            priority: 0,
            customFields: {
              'uni.ds_unid_destino': '',
              'uni.ds.unid_local_destino': '',
              'uni.cd_unid_destino': '',
              'uni.cd.unid_local_destino': '',
              'pac.cd_paciente': null,
              'pac.nm_paciente': null,
              'pac.sn_vip': '',
              'con.cd_convenio': null,
              'con.nm_convenio': null,
              'usr.cd_login': 'concierge',
              'tarefa.desc': clientData.survey_description_xml,
              'pac.cd_atendimento': null,
              'pac.dt_nascimento': null,
              'tarefa.classif': null,
              'cmp.nm_solic': 'concierge',
              'tsk.concierge_para_paciente': 'Sim',
              'tsk.concierge_quantidade': 1,
            }
          }
        }

        const returnBuildXmlSurvey = await new XmlController().BuildXmlSurvey({
          api_mv_token: clientData.api_mv_token,
          api_mv_url: clientData.api_mv_url,
          company_id: clientData.company_id,
          content: contentJson,
          nr_attendance: data.nr_attendance || '0'
        })
        if (!returnBuildXmlSurvey) {
          Log.error(`Build xml error, data: ${JSON.stringify({
            api_mv_token: clientData.api_mv_token,
            api_mv_url: clientData.api_mv_url,
            company_id: clientData.company_id,
            contentXML: contentJson,
            nr_attendance: data.nr_attendance || '0'
          })}`)
          return 'error'
        }

        const rSendXml = await new ApiService().sendXmlTo3Wings({
          url: clientData.endpoint_request,
          xml: returnBuildXmlSurvey
        })
        if (!rSendXml) {
          Log.error(`Send xml error, url: ${clientData.endpoint_request}, xml: ${returnBuildXmlSurvey}`)
          return 'error'
        }

        movementData.active = false
        movementData.save()

        surveyData.request_integration = returnBuildXmlSurvey
        surveyData.response_integration = rSendXml
        surveyData.intention = 'request_not_finished'
        surveyData.save()
        return 'request_not_finished'

      }else{
        // se mandou outro texto, que nao seja dos botoes
        return 'option_invalid'
      }
    }

    // case not status in survey
    Log.error(`Survey: status not found, data: ${JSON.stringify(data)}`)
    return 'error'
  }

  public async create () {
  }

  public async store () {
    // receive { in body: task_id: string }

    // depois de um tempo especifico da task for aberta,
    // um service vai enviar um request para esse controller
    // nesse momento, criar uma linha na tabela do nps,
    // aguardando para ser iniciada
  }

  public async show () {


  }

  public async edit () {
  }

  public async update () {
  }

  public async destroy () {
  }
}
