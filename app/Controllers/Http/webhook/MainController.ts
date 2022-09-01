import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

//utls
import TwilioResponse from 'App/Utils/TwilioResponse'
import Options from 'App/Utils/Options'

//controllers
import MovementsController from 'App/Controllers/Http/MovementsController'
import ClientsController from 'App/Controllers/Http/ClientsController'
import RequestOutController from 'App/Controllers/Http/RequestOutsController'
import SurveyController from 'App/Controllers/Http/SurveyController'
// Interfaces
import { IMessage } from 'App/Controllers/Interfaces/IMessages'
//import { IMovementStore } from 'App/Controllers/Interfaces/IMovement'

//models
import Movement from 'App/Models/Movement'

//service
import Api from 'App/Services/Api'

export default class MainController {

  public async index({ request, response, params }: HttpContextContract) {


    const From = request.input('From').substring(12, 200)
    const Body = request.input('Body')
    const client_id = params.client_id;

    let objMessage: IMessage = {
      client_id: client_id,
      cd_message: '',
      cd_setor: 0,
      menu_id: 0,
	  menu_order: 0,
      type_attendance_id: 3,
      nr_attendance: '',
      main_movement: 0,
      number: '',
      body: Body,
      from: From,
    }
    //#region informacoes do cliente
    const clientData = await new ClientsController().show(client_id)

    if (!clientData) {
      objMessage.cd_message = 'error'
      return new TwilioResponse().send(objMessage)
    }
    //#endregion informacoes do cliente

    //#region verificando se o number ja falou antes
      const ifNumberExists = await new MovementsController().showIfExists({ number: From, client_id })
      if (ifNumberExists) {
        await new MovementsController().store({
          number: From,
          nr_attendance: ifNumberExists.nr_attendance,
          status_movement_code: 'waiting',
          menu_id: null,
          submenu_id: null,
          quantity: null,
          main_movement: null,
          type_attendance: null,
          last_movement: null,
          keep_main_movement: false,
          client_id,
          more_service: false,
        })

      }
    //#endregion verificando se o number ja falou antes


    const checkNumber = await new MovementsController().show({ column: 'number', value: From, client_id })

	if (checkNumber){
    if (checkNumber.menu){
      objMessage.cd_setor = checkNumber.menu.setor
    }
	}
    //#region da verificacao do numero
    if (checkNumber === false) {

      const storeMovement = await new MovementsController().store({
        status_movement_code: 'waiting',
        number: From,
        nr_attendance: null,
        main_movement: null,
        menu_id: null,
        submenu_id: null,
        quantity: null,
        last_movement: null,
        client_id
      });

      storeMovement === false ? objMessage.cd_message = 'error' : objMessage.cd_message = 'init';
      return new TwilioResponse().send(objMessage)
    }
    //#endregion da verificacao do numero

    //#region da validacao do nr_attendance

    if (checkNumber.status_movement.cd_status_movement == 'waiting') {

      const statusNrAttendanceApi = await new Api().mv({
        url: clientData.api_mv_url,
        token: clientData.api_mv_token,
        nr_attendance: Body,
        company_id: clientData.company_id
      })

      if (statusNrAttendanceApi) {
        const storeMovement = await new MovementsController().store({
          status_movement_code: 'lobby',
          nr_attendance: ifNumberExists ? ifNumberExists.nr_attendance : Body,
          number: From,
          main_movement: checkNumber.main_movement,
          menu_id: null,
          submenu_id: null,
          quantity: null,
          last_movement: checkNumber.id,
          client_id: client_id
        })

        objMessage.cd_message = storeMovement ? 'main_menu' : 'error'
        objMessage.cd_setor = statusNrAttendanceApi.CD_SETOR || 0
      } else {
        objMessage.cd_message = 'lobby_attendance_not_found'

        await new MovementsController().store({
          status_movement_code: 'waiting',
          nr_attendance: null,
          number: From,
          main_movement: checkNumber.main_movement,
          menu_id: null,
          submenu_id: null,
          quantity: null,
          last_movement: checkNumber.id,
          client_id: client_id
        })
      }

      return new TwilioResponse().send(objMessage)
    } {
      const statusNrAttendanceApi = await new Api().mv({
        url: clientData.api_mv_url,
        token: clientData.api_mv_token,
        nr_attendance: checkNumber.nr_attendance,
        company_id: clientData.company_id,
      })

      if (!statusNrAttendanceApi) {

        const storeMovement = await new MovementsController().store({
          status_movement_code: 'waiting',
          number: From,
          nr_attendance: null,
          main_movement: null,
          menu_id: null,
          submenu_id: null,
          quantity: null,
          last_movement: checkNumber.id,
          client_id
        });

        storeMovement === false ? objMessage.cd_message = 'error' : objMessage.cd_message = 'waiting_attendance_invalid';

        return new TwilioResponse().send(objMessage)
      }

      objMessage.cd_setor = statusNrAttendanceApi.CD_SETOR || 0
    }
    //#endregion da validacao do nr_attendance

    //#region lobby
    if (checkNumber.status_movement.cd_status_movement === 'lobby') {
      return this.lobby({
        checkNumber,
        Body,
        objMessage,
        From,
        client_id,
      })
    }
    //#endregion lobby

    //#region menu
    if (checkNumber.status_movement.cd_status_movement === 'menu') {
      const isTypeAttendance =
        await new Options().isTypeAttendance({
          menu_id: checkNumber.menu.order,
          setor: objMessage.cd_setor,
          client_id: objMessage.client_id
        })

      if (isTypeAttendance) { // se o menu escolhido controla configuracao de tipo de atendimento
        const valMenu = await new Options().pacAcomp({
          menu_id: Body,
          setor: objMessage.cd_setor,
          client_id: objMessage.client_id
        })

        if (valMenu == true) {
          const storeMovement = await new MovementsController().store({
            status_movement_code: 'pac_acomp',
            nr_attendance: checkNumber.nr_attendance,
            number: From,
            main_movement: checkNumber.main_movement,
            menu_id: checkNumber.menu_id,
            submenu_id: null,
            quantity: null,
            last_movement: checkNumber.id,
            client_id,
			type_attendance: Body,
          })

          objMessage.cd_message = storeMovement ? 'submenu' : 'error'
        } else {
          objMessage.cd_message = 'option_invalid'
        }
        objMessage.menu_id = checkNumber.menu_id
        objMessage.submenu_id = 0
        objMessage.type_attendance_id = Body
        return new TwilioResponse().send(objMessage)

      } else {

        return this.submenu({
          checkNumber,
          Body,
          objMessage,
          From,
          client_id,
        })
      }

    }
    //#endregion menu

    //#region pac_acomp
    if (checkNumber.status_movement.cd_status_movement === 'pac_acomp') {
      return this.submenu({
        checkNumber,
        Body,
        objMessage,
        From,
        client_id,
      })
    }
    //#endregion pac_acomp

    //#region submenu
    if (checkNumber.status_movement.cd_status_movement === 'submenu') {

    }
    //#endregion submenu

    //#region quantity
    if (checkNumber.status_movement.cd_status_movement === 'quantity') {
      if (checkNumber.sub_menu_id == null || checkNumber.menu_id == null) {
        return false
      }
      const valQuantity = await new Options().quantity({
        submenu_id: checkNumber.sub_menu_id,
        menu_id: checkNumber.menu_id,
        quantity: Body,
      })

      if (valQuantity) {
        const storeMovement = await new MovementsController().store({
          status_movement_code: 'more_service',
          nr_attendance: checkNumber.nr_attendance,
          number: From,
          main_movement: checkNumber.main_movement,
          menu_id: checkNumber.menu_id,
          submenu_id: checkNumber.sub_menu_id,
          quantity: Body,
          last_movement: checkNumber.id,
          client_id: client_id,
        })

        objMessage.menu_id = checkNumber.menu_id
        objMessage.submenu_id = checkNumber.sub_menu_id
        objMessage.cd_message = storeMovement ? 'more_service' : 'error'

        return new TwilioResponse().send(objMessage)
      } else {
        objMessage.menu_id = checkNumber.menu_id
        objMessage.submenu_id = checkNumber.sub_menu_id
        objMessage.cd_message = 'option_invalid'

        return new TwilioResponse().send(objMessage)
      }
    }
    //#endregion quantity

    //#region more_service
    if (checkNumber.status_movement.cd_status_movement === 'more_service') {
      const valMoreService = await new Options().moreService({
        option: Body
      })

      objMessage.menu_id = checkNumber.menu_id || 0
	  objMessage.menu_order = checkNumber.menu.order || 0
      objMessage.submenu_id = checkNumber.sub_menu_id || 0
      objMessage.main_movement = checkNumber.main_movement || 0
      objMessage.nr_attendance = checkNumber.nr_attendance || ''
      objMessage.number = checkNumber.number

      if (valMoreService) {

        let statusFromMoreService: string
        let messageFromMoreService: string

        const ifMovMenuDefault = await new MovementsController().showMovMenusDefault({
          client_id,
          column: 'main_movement',
          value: checkNumber.main_movement
        })

        if (Body == 1){
          statusFromMoreService = !ifMovMenuDefault ? 'lobby' : 'menu'
          messageFromMoreService = !ifMovMenuDefault ? 'main_menu' : 'submenu'
          objMessage.more_service = true
        }else{

          statusFromMoreService = !ifMovMenuDefault ? 'lobby' : 'confirm'
          messageFromMoreService = !ifMovMenuDefault ? 'main_menu' : 'confirm_end_service'
          objMessage.more_service = false
        }

        // statusFromMoreService = Body == 1 ? 'menu' : 'confirm'
        // messageFromMoreService = Body == 1 ? 'submenu' : 'confirm_end_service'
        // objMessage.more_service = Body == 1 ? true : false

        const storeMovement = await new MovementsController().store({
          status_movement_code: statusFromMoreService,
          keep_main_movement: statusFromMoreService == 'lobby' ? true : false,
          nr_attendance: checkNumber.nr_attendance,
          number: From,
          main_movement: checkNumber.main_movement,
          menu_id: checkNumber.menu_id,
          submenu_id: Body == 2 ? checkNumber.sub_menu_id : null,
          quantity: null,
          last_movement: checkNumber.id,
          client_id: client_id,
          more_service: true,
        })

        objMessage.cd_message = storeMovement ? messageFromMoreService : 'error'
        return new TwilioResponse().send(objMessage)

      } else {
        objMessage.cd_message = 'option_invalid'
        return new TwilioResponse().send(objMessage)
      }
    }
    //#endregion more_service

    //#region confirm
    if (checkNumber.status_movement.cd_status_movement === 'confirm') {
      const valConfirm = await new Options().confirm({
        option: Body,
      })

      if (valConfirm) {
        objMessage.cd_message = Body == 1 ? 'end_service' : 'cancel_service'

       const storeMovement = await new MovementsController().store({
          status_movement_code: 'end_service',
          nr_attendance: checkNumber.nr_attendance,
          number: From,
          main_movement: checkNumber.main_movement,
          menu_id: checkNumber.menu_id,
          submenu_id: checkNumber.sub_menu_id,
          quantity: null,
          last_movement: checkNumber.id,
          client_id: client_id,
        })

        if (!storeMovement) {
          objMessage.cd_message = 'error'
        } else {
          // store requestOut

          if (checkNumber.main_movement == null || checkNumber.nr_attendance == null) {
            objMessage.cd_message = 'error'
            return new TwilioResponse().send(objMessage)
          }

          if (Body == 1) {
            await new RequestOutController().store({
              main_movement: checkNumber.main_movement,
              nr_attendance: checkNumber.nr_attendance,
              number: From,
              type_request_id: 1,
              client_id: client_id
            })
          }

        }

      } else {
        objMessage.cd_message = 'option_invalid'
      }

      return new TwilioResponse().send(objMessage)
    }
    //#endregion confirm

    //#region survey

      if (checkNumber.status_movement.cd_status_movement === 'survey_init') {
        objMessage.main_movement = !checkNumber.main_movement ? checkNumber.id : checkNumber.main_movement
        objMessage.nr_attendance = checkNumber.nr_attendance || '0'
        objMessage.cd_message = 'survey_init' // only, for parameter in controller of survey
        const npsReturn = await new SurveyController().process(objMessage)

        if (!npsReturn) {
          objMessage.cd_message = 'error'
          return new TwilioResponse().send(objMessage)
        }

        objMessage.cd_message = npsReturn
        return new TwilioResponse().send(objMessage)
      }

      if (checkNumber.status_movement.cd_status_movement === 'survey_experience') {
        objMessage.main_movement = !checkNumber.main_movement ? checkNumber.id : checkNumber.main_movement
        objMessage.nr_attendance = checkNumber.nr_attendance || '0'
        objMessage.cd_message = 'survey_experience' // only, for parameter in controller of survey
        const npsReturn = await new SurveyController().process(objMessage)

        if (!npsReturn) {
          objMessage.cd_message = 'error'
          return new TwilioResponse().send(objMessage)
        }

        objMessage.cd_message = npsReturn
        return new TwilioResponse().send(objMessage)
      }

    //#endregion survey


    return response.status(200).json(objMessage)

  }

  public async submenu(data: {
    checkNumber: Movement;
    Body: number;
    objMessage: IMessage;
    From: string;
    client_id: number;
  }) {
    if (data.checkNumber.menu_id == null || data.Body == null) {
      data.objMessage.cd_message = 'error'
      return new TwilioResponse().send(data.objMessage)
    }

    if (data.Body == 0){
      const storeMovement = await new MovementsController().store({
        status_movement_code: 'lobby',
        nr_attendance: data.checkNumber.nr_attendance,
        number: data.From,
        main_movement: data.checkNumber.main_movement,
        keep_main_movement: true,
        menu_id: null,
        submenu_id: null,
        quantity: null,
        last_movement: data.checkNumber.id || 0,
        client_id: data.client_id,
      })

      data.objMessage.cd_message = storeMovement ? 'main_menu' : 'error'
      return new TwilioResponse().send(data.objMessage)
    }

    const valSubMenu = await new Options().subMenu({
      menu_id: data.checkNumber.menu_id,
      submenu_id: data.Body,
      type_attendance_id: data.checkNumber.type_attendance || 3,
    })

	//console.log(`menu_id: ${data.checkNumber.menu_id}, body: ${data.Body}`);

    if (valSubMenu != null) {

      let status_movement_code = valSubMenu.active_quantity == true ? 'quantity' : 'more_service'
      let message_code = valSubMenu.active_quantity == true ? 'quantity' : 'more_service'

      const storeMovement = await new MovementsController().store({
        status_movement_code: status_movement_code,
        nr_attendance: data.checkNumber.nr_attendance,
        number: data.From,
        main_movement: data.checkNumber.main_movement,
        menu_id: data.checkNumber.menu_id,
        submenu_id: valSubMenu.id,
        quantity: null,
        last_movement: data.checkNumber.id || 0,
        client_id: data.client_id,
      })

      data.objMessage.cd_message = storeMovement ? message_code : 'error'
    } else {
      data.objMessage.cd_message = 'option_invalid'
    }
    data.objMessage.menu_id = data.checkNumber.menu_id
    data.objMessage.submenu_id = data.Body
    return new TwilioResponse().send(data.objMessage)
  }

  public async lobby(data: {
    checkNumber: Movement;
    Body: number;
    objMessage: IMessage;
    From: string;
    client_id: number;
  }) {
    const verMenu = await new Options().mainMenu({
      menu_id: data.Body,
      setor: data.objMessage.cd_setor,
      client_id: data.objMessage.client_id
    })



    if (!verMenu) {
      data.objMessage.cd_message = 'option_invalid'
      return new TwilioResponse().send(data.objMessage)

    } else {

      const menuIsDefault = await new Options().verifyMenuType({
        menu_id: data.Body,
        setor: data.objMessage.cd_setor,
        client_id: data.objMessage.client_id
      })

      if (menuIsDefault.type != 'default' && menuIsDefault.type != false){
        return await this.ifMenuNoDefault({
          checkNumber: data.checkNumber,
          Body: data.Body,
          objMessage: data.objMessage,
          From: data.From,
          client_id: data.client_id,
          type: menuIsDefault.type,
          submenu_id: menuIsDefault.submenu_id
        })
      }

      const isTypeAttendance =
      await new Options().isTypeAttendance({
        menu_id: data.Body,
        setor: data.objMessage.cd_setor,
        client_id: data.objMessage.client_id
      })

      const storeMovement = await new MovementsController().store({
        status_movement_code: 'menu',
        nr_attendance: data.checkNumber.nr_attendance,
        number: data.From,
        main_movement: data.checkNumber.main_movement,
        menu_id: verMenu.id, //data.Body
        submenu_id: null,
        quantity: null,
        last_movement: data.checkNumber.id,
        client_id: data.client_id
      })

      if (storeMovement) {
        data.objMessage.cd_message = isTypeAttendance ? 'pac_acomp' : 'submenu'
        data.objMessage.submenu_id = 0
        data.objMessage.menu_id = isTypeAttendance ? data.Body : verMenu.id

      } else {
        data.objMessage.cd_message = 'error'
      }

      return new TwilioResponse().send(data.objMessage)
    }
  }

  public async ifMenuNoDefault(data: {
    checkNumber: Movement;
    Body: number;
    objMessage: IMessage;
    From: string;
    client_id: number;
    type: string | boolean;
    submenu_id? : number;
  }) {

    // menu não é do tipo default,
    // status vai pra lobby (aguardando escolher o menu novamente)
    // response: resposta + menu

    if (data.type == 'link'){
      const storeMovement = await new MovementsController().store({
        status_movement_code: 'more_service',
        nr_attendance: data.checkNumber.nr_attendance,
        number: data.From,
        main_movement: data.checkNumber.main_movement,
        menu_id: null,
        submenu_id: null,
        quantity: null,
        last_movement: data.checkNumber.id,
        client_id: data.client_id
      })

      data.objMessage.cd_message = storeMovement ? 'noDefault' : 'error'
      data.objMessage.menu_id = data.Body
      return new TwilioResponse().send(data.objMessage)
    }

    if (data.type == 'no_submenu'){
      const storeMovement = await new MovementsController().store({
        status_movement_code: 'more_service',
        nr_attendance: data.checkNumber.nr_attendance,
        number: data.From,
        main_movement: data.checkNumber.main_movement,
        menu_id: data.Body,
        submenu_id: data.submenu_id || 1,
        quantity: null,
        last_movement: data.checkNumber.id,
        client_id: data.client_id
      })

      data.objMessage.cd_message = storeMovement ? 'noDefault' : 'error'
      data.objMessage.menu_id = data.Body
      return new TwilioResponse().send(data.objMessage)
    }


  }

}
