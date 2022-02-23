import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'moment'

//controllers
import SummariesController from 'App/Controllers/Http/SummariesController'

//interfaces
import { IOut, IOutItens } from 'App/Controllers/Interfaces/IRequest'

//models
import RequestOutModel from 'App/Models/RequestOut'

export default class RequestOutsController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({}: HttpContextContract) {
  }

  public async store (data: IOut) {

    const summaries = await new SummariesController().showForRequest({
      client_id: data.client_id,
      main_movement: data.main_movement,
      nr_attendance: data.nr_attendance,
      number: data.number,
    })

    let objCreateMany: any = [];

    for (let index = 0; index < summaries[0].length; index++) {

      const element = summaries[0][index];

      let activity: any = []
      activity.push({alternativeIdentifier: element.activity,})
      activity.push({alternativeIdentifier: element.accept,})

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
            alternativeIdentifier: element.team
          },
          activitiesOrigin: 4,
          teamExecution: 1,
          date: Moment().format('Y-M-D'),
          hour: Moment().format('H:mm'),
          activityRelationship: {activity},
          observation: element.service,
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
            'tarefa.desc': element.description,
            'pac.cd_atendimento': null,
            'pac.dt_nascimento': null,
            'tarefa.classif': null,
            'cmp.nm_solic': 'concierge',
            'tsk.concierge_para_paciente': element.serviceIsPatient == 'Sim' ? 'Sim' : (element.serviceIsPatient == 'Não' ? 'Não' : 'Sim'),
            'tsk.concierge_quantidade': element.sum_qtd,
          }
        }
      }

      objCreateMany.push({
        movement_id: element.main_movement,
        branches_movement: element.branches_movement,
        content: JSON.stringify(contentJson),
        number: data.number,
        nr_attendance: data.nr_attendance,
        type_request_id: data.type_request_id,
      })
    }

    objCreateMany.join(" ")

    const createManyRequestOutSingleRequest = await RequestOutModel.createMany(objCreateMany);

    return createManyRequestOutSingleRequest ? true : false

  }

  public async storeItens(data: IOutItens){

    const retSingleRequest = await RequestOutModel.find(data.requestOUtId)

    if (!retSingleRequest){
      return false;
    }

    const summariesItens = await new SummariesController().showForRequestItens({
      client_id: data.client_id,
      main_movement: data.main_movement,
      nr_attendance: data.nr_attendance,
      number: data.number,
      branches_movement: retSingleRequest.branches_movement,
      returnContentSingleRequest: retSingleRequest.return_content
    })

    let objCreateMany: any = [];

    for (let indexItens = 0; indexItens < summariesItens[0].length; indexItens++) {
      const element = summariesItens[0][indexItens];
      let uniqueKey = `${data.task}-${element.submenu_id}-${data.nr_attendance}`

      let contentJsonItens = {
        customEntityEntry: {
          description: uniqueKey,
          alternativeIdentifier: uniqueKey,
          customFields: {
            cad_cd_atendimento: element.nr_attendance,
            cad_cd_item: element.submenu_id,
            cad_nm_item: element.description,
            cad_qtd_item: element.quantity,
            cad_cd_tarefa: data.task,
            cad_data_pedido: Moment().format('Y-M-D'),
            cad_hora_pedido: Moment().format('H:m'),
          }
        }
      }

      objCreateMany.push({
        movement_id: element.main_movement,
        content: JSON.stringify(contentJsonItens),
        number: data.number,
        nr_attendance: data.nr_attendance,
        type_request_id: 2,
      })


    }

    objCreateMany.join(" ")

    const createManyRequestOutSingleRequestItens = await RequestOutModel.createMany(objCreateMany);

    return createManyRequestOutSingleRequestItens ? true : false
  }

  public async show () {

    const retReqOut =
    await RequestOutModel
    .query()
    .whereNull('return_content')
    .where('waiting_send', false)
    .where('type_request_id', 1)
    .preload('movements')
    .first();

    return retReqOut
  }

  public async showSend () {

    const retReqOut =
    await RequestOutModel
    .query()
    .whereNull('return_content')
    .where('waiting_send', true)
    .preload('movements')
    .first();

    return retReqOut
  }

  public async showItens () {

    const retReqOut =
    await RequestOutModel
    .query()
    .whereNull('return_content')
    .where('waiting_send', false)
    .where('type_request_id', 2)
    .preload('movements')
    .first();

    return retReqOut
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update (data) {
    const dataReqOut = await RequestOutModel.find(data.id)
    if (dataReqOut){
      dataReqOut.content = data.content
      dataReqOut.return_content = data.return_content
      dataReqOut.waiting_send = true
      dataReqOut.save()

      return true
    }

    return false

  }

  public async destroy ({}: HttpContextContract) {
  }
}
