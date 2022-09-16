import Day from 'dayjs'
//Controllers
import MovementsController from './MovementsController'
import XmlController from 'App/Controllers/Http/XmlsController'

//Models
import SubMenuModel from 'App/Models/SubMenu'
import ClientsModel from 'App/Models/Client'
import SurveyModel from 'App/Models/Survey'
import MovementsModel from 'App/Models/Movement'
import MessageModel from 'App/Models/Message'

//utils
import UmovMeUtil from 'App/Utils/umovMe'
import ApiService from 'App/Services/Api'
import TwilioResponse from 'App/Utils/TwilioResponse'
import Log from 'App/Utils/logs'
import {DateTime} from 'luxon'

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
      Log.info(`init survey data: ${surveyData.id} found`)
      // get client data
      const clientData = await MovementsModel.query()
      .where('main_movement', surveyData.request_outs.movement_id)
      .where('status_movement_id', 9)
      .preload('client').first();
      if (!clientData) return false
      Log.info(`init survey client data: ${clientData.client_id} found`)
      // if the task has been completed
      const retUmov = await new UmovMeUtil().searchTaskWithStatusEnd({
        url_base: clientData.client.endpoint_request,
        taskId: surveyData.request_outs.return_content
      })

      if (!retUmov) { // caso nao esteja finalizado, atualiza o updated_at, para colocar para o fim da fila
        surveyData.updatedAt = DateTime.local()
        await surveyData.save()
        return false
      }
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
      await surveyData.save()


      // Get submenu infos
      const submenuData = await SubMenuModel.find(surveyData.submenu_id)

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
    const movementData = await MovementsModel.query().where(`id` ,data.main_movement || 0).preload(`client`).first()

    if (!movementData) {
      Log.error(`No movementData found, data: ${JSON.stringify(data)}`)
      return {cd_message: 'error', submenu_id: null}
    }
    const surveyData = await SurveyModel.find(movementData.survey_id)
    if (!surveyData) {
      Log.error(`No surveyData found, movementData: ${JSON.stringify(movementData)}`)
      return {cd_message: 'error', submenu_id: null}
    }

    // case stop survey
    if (
      data.body.toUpperCase() == 'SAIR' ||
      data.body.toUpperCase() == 'PARAR'||
      data.body.toUpperCase() == '0'
      ){
        movementData.active = false
        await movementData.save()

        surveyData.intention = 'stop'
        await surveyData.save()

        Log.info(`Survey: ${surveyData.id} -> Intention: stop`)

        //start send xml for table nps in umovMe
        await new XmlController().BuildXmlSurveyCustom({
          survey_id: surveyData.id,
          url: movementData.client.endpoint_request_itens.replace('cad_concierge_item', 'nps') // change for custom nps table
        })
        //end send xml for table nps in umovMe

        return {cd_message: 'survey_cancel', submenu_id: null}
    }

    if (data.cd_message == 'survey_init'){
      if (data.body.toUpperCase() == 'SIM'){
        movementData.active = false
        await movementData.save()

        const newMovement = await new MovementsController().store({
          number: movementData.number,
          nr_attendance: movementData.nr_attendance,
          status_movement_code: 'survey_experience',
          menu_id: null,
          submenu_id: null,
          quantity: null,
          main_movement: null,
          type_attendance: null,
          last_movement: null,
          keep_main_movement: false,
          client_id: movementData.client_id,
          more_service: false,
          survey_id: surveyData.id
        })

        if (!newMovement) {
          Log.error(`Survey: Error in create new movement, intention: positive, survey_id: ${surveyData.id}`)
          return {cd_message: 'error', submenu_id: null}
        }

        surveyData.intention = `positive`
        surveyData.save()

        return {cd_message: 'survey_experience', submenu_id: surveyData.submenu_id}

      }else if (data.body.toUpperCase() == 'NÃO' || data.body.toUpperCase() == 'NAO'){

        movementData.active = false
        await movementData.save()

        surveyData.intention = 'negative'
        await surveyData.save()

        Log.info(`Survey: ${surveyData.id} -> Intention: negative`)

        //start send xml for table nps in umovMe
        await new XmlController().BuildXmlSurveyCustom({
          survey_id: surveyData.id,
          url: movementData.client.endpoint_request_itens.replace('cad_concierge_item', 'nps') // change for custom nps table
        })
        //end send xml for table nps in umovMe

        return {cd_message: 'survey_cancel', submenu_id: null}

      }else if (data.body.toUpperCase() == 'AINDA NÃO ATENDIDO' || data.body.toUpperCase() == 'AINDA NAO ATENDIDO'){

        // abrir a solicitacao no umovMe
        const retOpenTaskUmovMe = await this.openTaskUmovMe(data, `no_finished`, surveyData.submenu_id)

        if (!retOpenTaskUmovMe) return {cd_message: 'error', submenu_id: null}

        movementData.active = false
        await movementData.save()

        surveyData.request_integration = retOpenTaskUmovMe.xml
        surveyData.response_integration = retOpenTaskUmovMe.return
        surveyData.intention = 'request_not_finished'
        await surveyData.save()

        //start send xml for table nps in umovMe
        await new XmlController().BuildXmlSurveyCustom({
          survey_id: surveyData.id,
          url: movementData.client.endpoint_request_itens.replace('cad_concierge_item', 'nps') // change for custom nps table
        })
        //end send xml for table nps in umovMe

        return {cd_message: 'request_not_finished', submenu_id: null}

      }else{
        // se mandou outro texto, que nao seja dos botoes
        return {cd_message: 'option_invalid', submenu_id: null}
      }
    }else if (data.cd_message == 'survey_experience'){

      if (+data.body > 0){

        if (+data.body < movementData.client.survey_min_experience){
          // abrir solicitacao
          const retOpenTaskUmovMe = await this.openTaskUmovMe(data, `experience`, surveyData.submenu_id, +data.body)
          if (!retOpenTaskUmovMe) {
            Log.error(`Survey: error in send xml for min experience: ${data.body}, survey_id: ${surveyData.id}`)
            return {cd_message: 'error', submenu_id: null}
          }

          surveyData.request_integration = retOpenTaskUmovMe.xml
          surveyData.response_integration = retOpenTaskUmovMe.return
        }

        const newMovement = await new MovementsController().store({
          number: movementData.number,
          nr_attendance: movementData.nr_attendance,
          status_movement_code: 'survey_comments',
          menu_id: null,
          submenu_id: null,
          quantity: null,
          main_movement: null,
          type_attendance: null,
          last_movement: null,
          keep_main_movement: false,
          client_id: movementData.client_id,
          more_service: false,
          survey_id: surveyData.id
        })

        if (!newMovement) {
          Log.error(`Survey: Error in create new movement, experience: ${data.body}, survey_id: ${surveyData.id}`)
          return {cd_message: 'error', submenu_id: null}
        }

        surveyData.experience = data.body
        await surveyData.save()

        movementData.active = false
        await movementData.save()

        return {cd_message: 'survey_comments', submenu_id: null}
      }else{

        movementData.active = false
        await movementData.save()

        return {cd_message: 'survey_cancel', submenu_id: null}
      }

    }else if (data.cd_message == 'survey_comments'){
      surveyData.comments = data.body
      await surveyData.save()

      movementData.active = false
      await movementData.save()

      //start send xml for table nps in umovMe
      await new XmlController().BuildXmlSurveyCustom({
        survey_id: surveyData.id,
        url: movementData.client.endpoint_request_itens.replace('cad_concierge_item', 'nps') // change for custom nps table
      })
      //end send xml for table nps in umovMe

      return {cd_message: 'survey_end', submenu_id: null}
    }

    // case not status in survey
    Log.error(`Survey: status not found, data: ${JSON.stringify(data)}`)
    return {cd_message: 'error', submenu_id: null}
  }

  public async expiration (){
    const movementSurvey = await MovementsModel.query()
    .whereNotNull('survey_id')
    .whereIn('status_movement_id', [10,11,12,13]) // this ids, referency of survey status
    .where('active', true)
    .preload('survey')
    .preload('client')
    if (!movementSurvey) return false

    const message = await MessageModel.findBy('cd_message', 'survey_end')
    if (!message) return false

    for (let iMovSurvey = 0; iMovSurvey < movementSurvey.length; iMovSurvey++) {
      const surveyData = await SurveyModel.find(movementSurvey[iMovSurvey].survey_id)
      if (surveyData){
        const expirationTime = +movementSurvey[iMovSurvey].client.survey_expiration_time || 10
        const movementDate = Day(movementSurvey[iMovSurvey].createdAt.toString())
        const nowDateWithAddMinutes = Day()
        const diffDates = nowDateWithAddMinutes.diff(movementDate) / 60000 // for obtain minutes
        if (diffDates > expirationTime){
          // desative movements of surveys and update survey with expired intention
          movementSurvey[iMovSurvey].active = false
          surveyData.intention = 'expired'
          await movementSurvey[iMovSurvey].save()
          await surveyData.save()

          //start send xml for table nps in umovMe
          Log.info(`Send custom xml, init`)
          await new XmlController().BuildXmlSurveyCustom({
            survey_id: surveyData.id,
            url: movementSurvey[iMovSurvey].client.endpoint_request_itens.replace('cad_concierge_item', 'nps') // change for custom nps table
          })
          //end send xml for table nps in umovMe

          // send message
          await new TwilioResponse().create({
            accountSid: movementSurvey[iMovSurvey].client.account_sid,
            authToken: movementSurvey[iMovSurvey].client.auth_token,
            from: movementSurvey[iMovSurvey].client.phone_number,
            to: movementSurvey[iMovSurvey].number,
            message: message.description
          })
        }
      }
    }


    return true


  }

  public async openTaskUmovMe(data: IMessage, type: 'no_finished' | 'experience', submenu_id: number, note?: number){

    let alternativeIdentifier_team: any = ``
    let observation: any = ``
    let surveyActivity: any = ``
    let surveyAccept : any = ``

    const subMenuData = await SubMenuModel.find(submenu_id)
    if (!subMenuData) return false

    const clientData = await ClientsModel.find(data.client_id)
    if (!clientData) return false

    let description = type == `no_finished` ? `Tarefa não atendida: ${subMenuData.description}` : `Experiencia ruim, Nota: ${note} tarefa: ${subMenuData.description}`

    if (type == `no_finished`){
      if (clientData.active_config_menu_survey_no_finished){
        alternativeIdentifier_team = subMenuData.team
        observation = subMenuData.service
        surveyActivity = subMenuData.activity
        surveyAccept = subMenuData.accept
      }else{
        alternativeIdentifier_team = clientData.survey_no_finished_team
        observation = clientData.survey_no_finished_service
        surveyActivity = clientData.survey_no_finished_activity
        surveyAccept = clientData.survey_no_finished_accept
      }
    }

    if (type == `experience`){
      if (clientData.active_config_menu_survey_experience){
        alternativeIdentifier_team = subMenuData.team
        observation = subMenuData.service
        surveyActivity = subMenuData.activity
        surveyAccept = subMenuData.accept
      }else{
        alternativeIdentifier_team = clientData.survey_exp_team
        observation = clientData.survey_exp_service
        surveyActivity = clientData.survey_exp_activity
        surveyAccept = clientData.survey_exp_accept
      }
    }

    let activity: any = []
    activity.push({alternativeIdentifier: surveyActivity,})
    activity.push({alternativeIdentifier: surveyAccept,})

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
          alternativeIdentifier: alternativeIdentifier_team
        },
        activitiesOrigin: 4,
        teamExecution: 1,
        date: Day().format('YYYY-MM-DD'),
        hour: Day().format('HH:mm'),
        activityRelationship: {activity},
        observation,
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
          'tarefa.desc': description,
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
      nr_attendance: data.nr_attendance || '0',
      alternativeIdentifier: clientData.alternative_identifier
    })
    if (!returnBuildXmlSurvey) {
      Log.error(`Build xml error, data: ${JSON.stringify({
        api_mv_token: clientData.api_mv_token,
        api_mv_url: clientData.api_mv_url,
        company_id: clientData.company_id,
        contentXML: contentJson,
        nr_attendance: data.nr_attendance || '0',
        alternativeIdentifier: clientData.alternative_identifier
      })}`)
      return false
    }

    const rSendXml = await new ApiService().sendXmlTo3Wings({
      url: clientData.endpoint_request,
      xml: returnBuildXmlSurvey
    })
    if (!rSendXml) {
      Log.error(`Send xml error, url: ${clientData.endpoint_request}, xml: ${returnBuildXmlSurvey}`)
      return false
    }

    return {
      xml: returnBuildXmlSurvey,
      return: rSendXml
    }

  }
}
