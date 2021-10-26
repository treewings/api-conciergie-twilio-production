import { twiml } from "Twilio"
import Message from 'App/Utils/Messages'

import {IMessage} from 'App/Controllers/Interfaces/IMessages'

export default class TwilioResponse {
    async send(data: IMessage) {

      const retMessage = await new Message().default(data)

      const objTwiml = new twiml.MessagingResponse()

      // lembrar de adicionar nesse ponto o log das mensagens

      return objTwiml.message(retMessage).toString()
    }
}

module.exports = TwilioResponse
