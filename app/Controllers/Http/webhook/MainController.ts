import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

//utls
import TwilioResponse from 'App/Utils/TwilioResponse'
import Options from 'App/Utils/Options'

//controllers
import MovementsController from 'App/Controllers/Http/MovementsController'
import ClientsController from 'App/Controllers/Http/ClientsController'
import RequestOutController from 'App/Controllers/Http/RequestOutsController'

// Interfaces
import { IMessage } from 'App/Controllers/Interfaces/IMessages'
//import { IMovementStore } from 'App/Controllers/Interfaces/IMovement'

//models
import Movement from 'App/Models/Movement'

//service
import Api from 'App/Services/Api'

export default class MainController {

  public async index ({ request, response } : HttpContextContract) {


    const From = request.input('From').substring(12, 200)
    const Body = request.input('Body')
    const client_id = 1;

    let objMessage: IMessage = {
      client_id: client_id,
      cd_message: '',
      cd_setor: 50,
      menu_id: 0,
      type_attendance_id: 3,
      nr_attendance: '',
      main_movement: 0,
      number: ''
    }
    //#region informacoes do cliente
      const clientData = await new ClientsController().show(client_id)

      if (!clientData){
        objMessage.cd_message = 'error'
        return new TwilioResponse().send(objMessage)
      }
    //#endregion informacoes do cliente

    const checkNumber = await new MovementsController().show({column: 'number', value: From, client_id})

    //#region da verificacao do numero
      if (checkNumber === false){

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

        storeMovement === false ? objMessage.cd_message = 'error'  : objMessage.cd_message = 'init';
        return new TwilioResponse().send(objMessage)
      }
    //#endregion da verificacao do numero

    //#region da validacao do nr_attendance

      if (checkNumber.status_movement.cd_status_movement == 'waiting'){

        const statusNrAttendanceApi = await new Api().mv({
          url: clientData.api_mv_url,
          token: clientData.api_mv_token,
          nr_attendance: Body
        })

        if (statusNrAttendanceApi){
          const storeMovement = await new MovementsController().store({
            status_movement_code: 'lobby',
            nr_attendance: Body,
            number: From,
            main_movement: checkNumber.main_movement,
            menu_id: null,
            submenu_id: null,
            quantity: null,
            last_movement: checkNumber.id,
            client_id: client_id
          })

          objMessage.cd_message = storeMovement ? 'main_menu' : 'error'
        }else{
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
      }{
        const statusNrAttendanceApi = await new Api().mv({
          url: clientData.api_mv_url,
          token: clientData.api_mv_token,
          nr_attendance: checkNumber.nr_attendance,
        })

        if (!statusNrAttendanceApi){

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

          storeMovement === false ? objMessage.cd_message = 'error'  : objMessage.cd_message = 'waiting_attendance_invalid';

          return new TwilioResponse().send(objMessage)
        }
      }
    //#endregion da validacao do nr_attendance

    //#region lobby
      if (checkNumber.status_movement.cd_status_movement === 'lobby'){
        const verMenu = await new Options().mainMenu({
          menu_id: Body,
          setor: objMessage.cd_setor,
          client_id: objMessage.client_id
        })

        if (!verMenu){
          objMessage.cd_message = 'option_invalid'
          return new TwilioResponse().send(objMessage)

        }else{
          const isTypeAttendance =
          await new Options().isTypeAttendance({
            menu_id: Body,
            setor: objMessage.cd_setor,
            client_id: objMessage.client_id
          })

          const storeMovement = await new MovementsController().store({
            status_movement_code: 'menu',
            nr_attendance: checkNumber.nr_attendance,
            number: From,
            main_movement: checkNumber.main_movement,
            menu_id: Body,
            submenu_id: null,
            quantity: null,
            last_movement: checkNumber.id,
            client_id
          })

          if (storeMovement){
            objMessage.cd_message = isTypeAttendance ? 'pac_acomp' : 'submenu'
            objMessage.submenu_id = 0
            objMessage.menu_id = Body

          }else{
            objMessage.cd_message = 'error'
          }

          return new TwilioResponse().send(objMessage)

        }
      }
    //#endregion lobby

    //#region menu
      if (checkNumber.status_movement.cd_status_movement === 'menu'){
        const isTypeAttendance =
        await new Options().isTypeAttendance({
          menu_id: checkNumber.menu_id,
          setor: objMessage.cd_setor,
          client_id: objMessage.client_id
        })

        if (isTypeAttendance){ // se o menu escolhido controla configuracao de tipo de atendimento
          const valMenu = await new Options().pacAcomp({
            menu_id: Body,
            setor: objMessage.cd_setor,
            client_id: objMessage.client_id
          })

          if (valMenu == true){
            const storeMovement = await new MovementsController().store({
              status_movement_code: 'pac_acomp',
              nr_attendance: checkNumber.nr_attendance,
              number: From,
              main_movement: checkNumber.main_movement,
              menu_id: checkNumber.menu_id,
              submenu_id: null,
              quantity: null,
              last_movement: checkNumber.id,
              client_id
            })

            objMessage.cd_message = storeMovement ? 'submenu' : 'error'
          }else{
            objMessage.cd_message = 'option_invalid'
          }
          objMessage.menu_id    = checkNumber.menu_id
          objMessage.submenu_id = 0
          objMessage.type_attendance_id = Body
          return new TwilioResponse().send(objMessage)

        }else{

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
      if (checkNumber.status_movement.cd_status_movement === 'pac_acomp'){
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
    if (checkNumber.status_movement.cd_status_movement === 'submenu'){

    }
    //#endregion submenu

    //#region quantity
      if (checkNumber.status_movement.cd_status_movement === 'quantity'){
        if (checkNumber.sub_menu_id == null || checkNumber.menu_id == null){
          return false
        }
        const valQuantity = await new Options().quantity({
          submenu_id: checkNumber.sub_menu_id,
          menu_id: checkNumber.menu_id,
          quantity: Body,
        })

        if(valQuantity) {
          const storeMovement = await new MovementsController().store({
            status_movement_code: 'more_service',
            nr_attendance: checkNumber.nr_attendance,
            number: From,
            main_movement: checkNumber.main_movement,
            menu_id: checkNumber.menu_id,
            submenu_id: checkNumber.sub_menu_id,
            quantity: Body,
            last_movement: checkNumber.id,
            client_id : client_id,
          })

          objMessage.menu_id    = checkNumber.menu_id
          objMessage.submenu_id = checkNumber.sub_menu_id
          objMessage.cd_message = storeMovement ? 'more_service' : 'error'

          return new TwilioResponse().send(objMessage)
        }else{
            objMessage.menu_id    = checkNumber.menu_id
            objMessage.submenu_id = checkNumber.sub_menu_id
            objMessage.cd_message = 'option_invalid'

            return new TwilioResponse().send(objMessage)
        }
      }
    //#endregion quantity

    //#region more_service
    if (checkNumber.status_movement.cd_status_movement === 'more_service'){
      const valMoreService = await new Options().moreService({
        option: Body
      })

      objMessage.menu_id        = checkNumber.menu_id
      objMessage.submenu_id     = checkNumber.sub_menu_id
      objMessage.main_movement  = checkNumber.main_movement || 0
      objMessage.nr_attendance  = checkNumber.nr_attendance || ''
      objMessage.number         = checkNumber.number

      if (valMoreService){
        let statusFromMoreService: string
        let messageFromMoreService: string
        statusFromMoreService   = Body == 1 ? 'menu' : 'confirm'
        messageFromMoreService  = Body == 1 ? 'submenu' : 'confirm_end_service'
        objMessage.more_service = Body == 1 ? true : false

        const storeMovement = await new MovementsController().store({
          status_movement_code: statusFromMoreService,
          nr_attendance: checkNumber.nr_attendance,
          number: From,
          main_movement: checkNumber.main_movement,
          menu_id: checkNumber.menu_id,
          submenu_id: Body == 2 ? checkNumber.sub_menu_id : null,
          quantity: null,
          last_movement: checkNumber.id,
          client_id : client_id,
          more_service: true,
        })

        objMessage.cd_message = storeMovement ? messageFromMoreService : 'error'
        return new TwilioResponse().send(objMessage)

      }else{
        objMessage.cd_message = 'option_invalid'
        return new TwilioResponse().send(objMessage)
      }
    }
    //#endregion more_service

    //#region confirm
    if (checkNumber.status_movement.cd_status_movement === 'confirm'){
      const valConfirm = await new Options().confirm({
        option: Body,
      })

      if (valConfirm){
        objMessage.cd_message = Body == 1 ? 'end_service' : 'cancel_service'

        // store movement
        // const storeMovement = await new MovementsController().store({
        //   status_movement_code: 'end_service',
        //   nr_attendance: checkNumber.nr_attendance,
        //   number: From,
        //   main_movement: checkNumber.main_movement,
        //   menu_id: checkNumber.menu_id,
        //   submenu_id: checkNumber.sub_menu_id,
        //   quantity: null,
        //   last_movement: checkNumber.id,
        //   client_id : client_id,
        // })

        const storeMovement = true;

        if (!storeMovement){
          objMessage.cd_message = 'error'
        }else{
          // store requestOut

          if (checkNumber.main_movement == null || checkNumber.nr_attendance == null){
            objMessage.cd_message = 'error'
            return new TwilioResponse().send(objMessage)
          }

          await new RequestOutController().store({
            main_movement: checkNumber.main_movement,
            nr_attendance: checkNumber.nr_attendance,
            number: From,
            type_request_id: 1,
            client_id: client_id
          })
        }

      }else{
        objMessage.cd_message = 'option_invalid'
      }

      return new TwilioResponse().send(objMessage)
    }
    //#endregion confirm

    return response.status(200).json({From, Body})

  }

  public async submenu(data: {
    checkNumber: Movement;
    Body: number;
    objMessage: IMessage;
    From: string;
    client_id: number;
  }){
    if (data.checkNumber.menu_id == null || data.Body == null){
      data.objMessage.cd_message = 'error'
      return new TwilioResponse().send(data.objMessage)
    }

    const valSubMenu = await new Options().subMenu({
      menu_id: data.checkNumber.menu_id,
      submenu_id: data.Body,
      type_attendance_id: 0,
    })

    if (valSubMenu != null){

      let status_movement_code = valSubMenu.active_quantity == true ? 'quantity' : 'more_service'
      let message_code = valSubMenu.active_quantity == true ? 'quantity' : 'more_service'

      const storeMovement = await new MovementsController().store({
        status_movement_code: status_movement_code,
        nr_attendance: data.checkNumber.nr_attendance,
        number: data.From,
        main_movement: data.checkNumber.main_movement,
        menu_id: data.checkNumber.menu_id,
        submenu_id: data.Body,
        quantity: null,
        last_movement: data.checkNumber.id || 0,
        client_id : data.client_id,
      })

      data.objMessage.cd_message = storeMovement ? message_code : 'error'
    }else{
      data.objMessage.cd_message = 'option_invalid'
    }
    data.objMessage.menu_id    = data.checkNumber.menu_id
    data.objMessage.submenu_id = data.Body
    return new TwilioResponse().send(data.objMessage)
  }


}
