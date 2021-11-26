import Axios from 'axios'
import { IApiMV, ISendXmlTo3Wings } from 'App/Controllers/Interfaces/IApi'
import qs from 'qs'
import fastXmlParser from 'fast-xml-parser'

export default class Api {
  public async mv(data: IApiMV) {
    const url = `${data.url}/${data.nr_attendance}/${data.token}`
	console.log();
    const ret = Axios.get(url)
    .then(function (response: any) {
      let arr = response.data

      return arr != null ? arr : false
    })
    .catch(function () { //error
      console.error('Axios: erro ao acessar o endpoint MV')
      return false
    });

    return ret

  }

  public async dataMv(data: IApiMV) {
    const url = `${data.url}/${data.nr_attendance}/${data.token}`

    const ret = Axios.get(url)
    .then(function (response: any) {
      let arr = response.data.CD_ATENDIMENTO

      // let dadosFake = {
      //   cd_setor_leito: '1182-1209',
      //   paciente_vip: null,
      //   cd_atendimento: '2284299',
      //   cd_paciente: '2122735',
      //   nm_paciente: 'JOSE MARQUES FILHO',
      //   cd_convenio: '1',
      //   nm_convenio: 'INTERNACAO SUS',
      //   dt_nascimento: '06/05/1959',
      //   cd_multi_empresa: '1',
      //   telefone: '991122224',
      //   precaucao: null
      // }

      return arr != null ? response.data : false
    })
    .catch(function () { //error
      console.error('Axios: erro ao acessar o endpoint MV')
      return false
    });

    return ret

  }

  public async sendXmlTo3Wings(data: ISendXmlTo3Wings) {

    try {
      const url = data.url

      let options: Object = {
        method: 'POST',
        url: url,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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
