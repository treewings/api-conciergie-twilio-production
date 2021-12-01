//models
import MessageModel from 'App/Models/Message';

//controllers
import MenuController from 'App/Controllers/Http/MenusController';
import SubMenuController from 'App/Controllers/Http/SubMenusController';
import SummaryController from 'App/Controllers/Http/SummariesController'


// interfaces
import {IMessage} from 'App/Controllers/Interfaces/IMessages'

//Utils
import Options from 'App/Utils/Options'

export default class Messages {
    async default(data: IMessage) {

      const retMessage = await MessageModel.findBy('cd_message', data.cd_message);

      if (data.cd_message == 'main_menu'){

        let retMenu = '\n';
        let ico = '';


        if (data.menu_id == null){
          return `erro`
        }

        const menus = await new MenuController().show({
          setor: data.cd_setor,
          client_id: data.client_id,
          menu_id: data.menu_id,
        })

        if (menus == null){
          return `Não foi encontrado menu disponível.`
        }

        menus.forEach(async element => {

          ico = this.icons(element.icon)

          retMenu += `*${element.order}* - ${element.description} ${ico}\n`

        });

        return `${retMessage?.description} \n${retMenu}`
      }

      if (data.cd_message == 'noDefault'){

        let retMenu = '\n';


        if (data.menu_id == null){
          return `erro`
        }

        const menusForId = await new MenuController().showForId({
          setor: data.cd_setor,
          client_id: data.client_id,
          menu_id: data.menu_id,
        })

        const retMessageMoreService = await MessageModel.findBy('cd_message', 'more_service');

        return `${menusForId?.message}\n\n ${retMessageMoreService?.description} ${retMenu}`
      }

      if (data.cd_message == 'submenu'){

        if (data.menu_id && data.more_service == true){
          const isTypeAttendance = await new Options().isTypeAttendance({
            menu_id: data.menu_id,
            setor: data.cd_setor,
            client_id: data.client_id
          })

          if (isTypeAttendance){ // se o menu escolhido controla configuracao de tipo de atendimento
            let returnMessage = await MessageModel.findBy('cd_message', 'pac_acomp');
            return returnMessage === null ? '' : returnMessage.description
          }
        }

        let retSubMenu = '\n';
        let ico = '';

        if (data.menu_id == null || data.submenu_id == null || data.type_attendance_id == null){
          return 'erro';
        }

        const subMenus = await new SubMenuController().show({
          menu_id: data.menu_id,
          submenu_id: data.submenu_id,
          type_attendance_id: data.type_attendance_id,
        })

        if (subMenus == null){
          return `não foi encontrado submenu disponível.`
        }

        subMenus.forEach(async element => {

          retSubMenu += `*${element.order}* - ${element.description} ${ico}\n`

        });

        retSubMenu += `0 - voltar`

        return `${retMessage?.description} \n${retSubMenu}`
      }

      if (data.cd_message == 'quantity'){

        let retSubMenu = '\n';

        if (data.menu_id == null || data.submenu_id == null || data.type_attendance_id == null){
          return 'erro';
        }

        const subMenus = await new SubMenuController().showForId({
          submenu_id: data.submenu_id,
          menu_id: data.menu_id
        })

        if (subMenus == null){
          return `erro`
        }

        retSubMenu = `${subMenus.description}, qual a quantidade desejada? (digite a quantidade de ${subMenus.min_quantity} a ${subMenus.max_quantity})`

        return `${retMessage?.description} \n${retSubMenu}`
      }

      if (data.cd_message == 'confirm_end_service'){

        const retMessageSummry = await MessageModel.findBy('cd_message', 'title_summary');

        if (data.main_movement == null || data.number == null || data.nr_attendance == null){
          return 'erro'
        }

        const getMovements = await new SummaryController().show({
          client_id: data.client_id,
          main_movement: data.main_movement,
          nr_attendance: data.nr_attendance || '',
          number: data.number,
        })

        let subMenu: string = '';
        let menu: string = '';
        let descMenu: string = '';

        getMovements.forEach(element => {
          if (element.menu.description != descMenu) {
            // menu = '- '+element.menu.description+' '+this.icons(element.menu.icon)
            menu = `*${element.menu.description}* ${this.icons(element.menu.icon)}`
          }else{
            menu = ''
          }

          subMenu += `- ${menu}\n${element.sub_menu.description}\n Quantidade: ${element.quantity || 1}\n Prazo: ${element.sub_menu.time_attendance}\n\n`

          descMenu = element.menu.description

        });

        let message = `${retMessageSummry?.description}\n\n${subMenu}`

        let summary = `${message} \n\n ${retMessage?.description}`
        console.log(summary)
        return summary
      }

      if (data.cd_message == 'end_service' || data.cd_message == 'cancel_service'){
        const menus = await new MenuController().show({
          setor: data.cd_setor,
          client_id: data.client_id,
          menu_id: 0, // nao é usada nesse momento
        })

        if (menus == null){
          return `erro`
        }

        let retMenu: string = '';
        let ico: string;

        menus.forEach(async element => {

          ico = this.icons(element.icon)

          retMenu += `${element.order} - ${element.description} ${ico}\n`

        });

       // console.log(`${retMessage?.description} \n${retMenu}`)

        return `${retMessage?.description} \n${retMenu}`
      }


      return retMessage === null ? '' : retMessage.description;
    }

    icons(data: any) {
      let ico = '';
      switch (data){
        case 'hotelaria': ico = '🛏️'
        break

        case 'lavanderia': ico = '🧹'
        break

        default: ico = ''
      }

      return ico;
    }

}



module.exports = Messages
