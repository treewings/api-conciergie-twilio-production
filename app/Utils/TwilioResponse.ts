import { twiml } from "Twilio"
import Message from 'App/Utils/Messages'

import {IMessage} from 'App/Controllers/Interfaces/IMessages'
import LogAccess from 'App/Controllers/Http/LogAccessesController'

export default class TwilioResponse {
    async send(data: IMessage) {

      const retMessage = await new Message().default(data)

      const objTwiml = new twiml.MessagingResponse()

      // log das conversas
        await new LogAccess().store({
          number: data.from,
          received: data.body,
          send: retMessage.toString()
        })
      // fim log das conversas

      return objTwiml.message(retMessage).toString()
    }
}

module.exports = TwilioResponse
