import Axios from 'axios'
import { parseString } from 'xml2js'
export default class umovMe {
  // consults tasks with status: end
  async searchTaskWithStatusEnd(data: { taskId: string, url_base: string }) {
    let returnXML: any = `0`;
    const url = data.url_base.replace(`.xml`, `/${data.taskId}.xml`)
    const ret = await Axios({
        method: 'GET',
        url,
        data: null,
      }
    ).then(function (response: any) {

      return response.data
    })

    parseString(`<?xml version="1.0" encoding="UTF-8"?>${ret}`,
    (err, result) => {
      if (err) return
      returnXML = result.schedule.situation[0].id
      return;
    })

    // return returnXML == 50 ? true : false;
    return returnXML == 50 ? false : true;
  }

}


