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

      const lastMovementData =
        await MovementsModel.query()
        .where('number', surveyData.request_outs.number)
        .where('active', true)
        .first();

      // if in attendance for bot
      if (lastMovementData) if (lastMovementData.status_movement_id > 2) return false

      // change status in movements for survey
      // dev here

      // if the task has been completed
      // dev here

      // if all ok, get client data
      const movementData = await MovementsModel.query().where('id', surveyData.request_outs.movement_id).preload('client').first();
      if (!movementData) return false

      // twilio message
      // const returnTwilio = await new TwilioResponse().create({
      //   accountSid: movementData.client.account_sid,
      //   authToken: movementData.client.auth_token,
      //   from: movementData.client.phone_number,
      //   to: surveyData.request_outs.number,
      //   message: 'oi teste'
      // })
      // if (!returnTwilio) return false

      //console.log(surveyData.id)

      surveyData.contact_at = Day().format()
      surveyData.save()

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
