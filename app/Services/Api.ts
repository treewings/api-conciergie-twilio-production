import Axios from 'axios'
import { IApiMV, ISendXmlTo3Wings } from 'App/Controllers/Interfaces/IApi'
import qs from 'qs'
import fastXmlParser from 'fast-xml-parser'

export default class Api {
  public async mv(data: IApiMV) {
    const url = `${data.url}`
    let dataTranslate = {
      CD_SETOR_LEITO: `252-1686`,
      SN_VIP: false,
      CD_ATENDIMENTO: 3927539,
      CD_PACIENTE: 2332869,
      NM_PACIENTE: 'PAULA MATTOS LOPES MACIEL',
      CD_CONVENIO: 152,
      NM_CONVENIO: 'AMIL ASSIST MED - GRUPO AMIL',
      DT_NASCIMENTO: '1977-05-17 02:00:00',
      TELEFONE: '21988691929',
      CD_SETOR: 252,
      PREUCAUCAO: null,
      url
    }

    return dataTranslate

  }

  public async dataMv(data: IApiMV) {
    const url = `${data.url}`

    let dataTranslate = {
      CD_SETOR_LEITO: `252-1686`,
      SN_VIP: false,
      CD_ATENDIMENTO: 3927539,
      CD_PACIENTE: 2332869,
      NM_PACIENTE: 'PAULA MATTOS LOPES MACIEL',
      CD_CONVENIO: 152,
      NM_CONVENIO: 'AMIL ASSIST MED - GRUPO AMIL',
      DT_NASCIMENTO: '1977-05-17 02:00:00',
      TELEFONE: '21988691929',
      CD_SETOR: 252,
      PREUCAUCAO: null,
      url
    }

    return dataTranslate

  }

  public async sendXmlTo3Wings(data: ISendXmlTo3Wings) {

    try {
      const url = data.url

      let options: Object = {
        method: 'POST',
        url: url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
          'data': data.xml
        })
      }

      const ret = await Axios.request(options)
        .then(function (response: any) {
          let arr = fastXmlParser.parse(response.data)

          return arr != null ? arr.result.resourceId : false
        })
        .catch(function (error) { //error
          //console.error(error.response)
          return error.toString()
        });

      return ret

    } catch (error) {
      console.log(error)

      return false
    }



  }
}
