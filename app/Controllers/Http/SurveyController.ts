import SurveyModel from 'App/Models/Survey'
import MovementsModel from 'App/Models/Movement'
import MovementsController from './MovementsController'
import TwilioResponse from 'App/Utils/TwilioResponse'
import Day from 'dayjs'
export default class SurveyController {
  public async index () {
    try {
      const surveyData = await SurveyModel.query()
      .whereNull('contact_at')
      .preload('request_outs')
      .orderBy('updated_at') // orderBy, for balance in contacts
      .first();
      if (!surveyData) return false
      console.log(`survey: ${surveyData.id}`)

      // if the task has been completed
      // dev here

      // get client data
      const clientData = await MovementsModel.query()
      .where('main_movement', surveyData.request_outs.movement_id)
      .where('status_movement_id', 9)
      .preload('client').first();
      if (!clientData) return false

      console.log(`client: ${clientData.id}`)

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

      console.log(`nr_attendance: ${clientData.nr_attendance}`)

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
      })

      //console.log(surveyData.id)
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

        // twilio message
      const returnTwilio =
        await new TwilioResponse().create({
          accountSid: clientData.client.account_sid,
          authToken: clientData.client.auth_token,
          from: clientData.client.phone_number,
          to: surveyData.request_outs.number,
          message: 'oi teste'
        })
      if (!returnTwilio) return false

      return true;

    } catch (error) {
      console.log(error)
    }


  }

  public async test (data: {
    checkNumber: any,
    Body: any,
    From: any,
    client_id: any,
    objMessage: any
  }) {
    // process nps here
    // model: NpsModel

    // esse controller previamente sera chamado por uma cron
    // que devera verificar se ha alguma pesquisa para ser feita,
    // o que chegar aqui é porque nao tem conversa corrente,

    // indentificando isso ja é necessario inativar a linha
    // de lobby que foi criada no fim do atendimento e começar a pesquisa


    if(data.checkNumber.status_movement.cd_status_movement == "nps"){

      if(!(data.Body == 1 || data.Body == 3)){
        await new MovementsController().store({
          status_movement_code: 'nps_ending',
          nr_attendance: data.checkNumber.nr_attendance,
          number: data.From,
          main_movement: data.checkNumber.main_movement,
          menu_id: data.checkNumber.menu_id,
          submenu_id: data.checkNumber.sub_menu_id,
          quantity: null,
          last_movement: data.checkNumber.id,
          client_id: data.client_id,
        })
        data.objMessage.cd_message = 'no_nps'
      return data.objMessage
      }

      if(data.Body == 1){
        await new MovementsController().store({
          status_movement_code: 'nps_waiting',
          nr_attendance: data.checkNumber.nr_attendance,
          number: data.From,
          main_movement: data.checkNumber.main_movement,
          menu_id: data.checkNumber.menu_id,
          submenu_id: data.checkNumber.sub_menu_id,
          quantity: null,
          last_movement: data.checkNumber.id,
          client_id: data.client_id,
        })

        data.objMessage.cd_message = 'nps_positive_msg_1'
        return data.objMessage
      }

      if(data.Body == 3){
        await new MovementsController().store({
          status_movement_code: 'nps_ending',
          nr_attendance: data.checkNumber.nr_attendance,
          number: data.From,
          main_movement: data.checkNumber.main_movement,
          menu_id: data.checkNumber.menu_id,
          submenu_id: data.checkNumber.sub_menu_id,
          quantity: null,
          last_movement: data.checkNumber.id,
          client_id: data.client_id,
        })

        data.objMessage.cd_message = 'no_request_nps'
        return data.objMessage
      }

    }

    if(data.checkNumber.status_movement.cd_status_movement == "nps_waiting"){

      //Valor que irá abrir uma nova tarefa.
      //Ainda a se fazer
      const x = 6;

      if(!(data.Body >= 0 && data.Body <=10)){
        await new MovementsController().store({
          status_movement_code: 'nps_ending',
          nr_attendance: data.checkNumber.nr_attendance,
          number: data.From,
          main_movement: data.checkNumber.main_movement,
          menu_id: data.checkNumber.menu_id,
          submenu_id: data.checkNumber.sub_menu_id,
          quantity: null,
          last_movement: data.checkNumber.id,
          client_id: data.client_id,
        })
      }else{
        data.objMessage.cd_message = 'nps_positive_msg_2'

        await new MovementsController().store({
          status_movement_code: 'nps_user_comments',
          nr_attendance: data.checkNumber.nr_attendance,
          number: data.From,
          main_movement: data.checkNumber.main_movement,
          menu_id: data.checkNumber.menu_id,
          submenu_id: data.checkNumber.sub_menu_id,
          quantity: null,
          last_movement: data.checkNumber.id,
          client_id: data.client_id,
        })

        if(data.Body < x){

        }

        //Objeto para alimentar a model de nps
        //Ainda n'ao implementado
        const body = {
          request_number: '',
          task_group: '',
          task:'',
          agent:'',
          request_hour:'',
          request_complete_hour:'',
        }

        return data.objMessage
      }
    }

    if(data.checkNumber.status_movement.cd_status_movement == "nps_user_comments"){
      if(data.Body == 0){
        await new MovementsController().store({
          status_movement_code: 'nps_ending',
          nr_attendance: data.checkNumber.nr_attendance,
          number: data.From,
          main_movement: data.checkNumber.main_movement,
          menu_id: data.checkNumber.menu_id,
          submenu_id: data.checkNumber.sub_menu_id,
          quantity: null,
          last_movement: data.checkNumber.id,
          client_id: data.client_id,
        })
      }

      if(data.Body == 1){
        await new MovementsController().store({
          status_movement_code: 'nps_ending',
          nr_attendance: data.checkNumber.nr_attendance,
          number: data.From,
          main_movement: data.checkNumber.main_movement,
          menu_id: data.checkNumber.menu_id,
          submenu_id: data.checkNumber.sub_menu_id,
          quantity: null,
          last_movement: data.checkNumber.id,
          client_id: data.client_id,
        })

        // Constante para guardar o comentário a model
        // Ainda não implementado
        const dataReturn = {
          nps_comment:''
        }
      }
    }

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
