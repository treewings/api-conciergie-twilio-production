import Axios from 'axios'
import { IApiMV, ISendXmlTo3Wings } from 'App/Controllers/Interfaces/IApi'
import qs from 'qs'
import fastXmlParser from 'fast-xml-parser'

export default class Api {
  public async mv(data: IApiMV) {
    const url = `${data.url}`
    const body = {
      i_code: data.nr_attendance,
      consult: 'attendance',
      company_id: data.company_id
    }
    const headers = {
      ACCESS_KEY: data.token
    }

    console.log(JSON.stringify({
      url: url,
      data: body,
      headers: headers
    }))

    const ret = Axios({
        method: 'post',
        url: url,
        data: body,
        headers: headers
      }
    ).then(function (response: any) {

        let status = response.data.message.status

        if (status == 200){
          const {
            convenio: { cd_convenio, nm_convenio },
            setor: { cd_setor },
            leito: { cd_leito },
          } = response.data.message.Body.atendimento

          const {
            sn_vip,
            cd_paciente,
            nm_paciente,
            dt_nascimento,
            telefone
          } = response.data.message.Body.paciente

          let dataTranslate = {
            CD_SETOR_LEITO: `${cd_setor}-${cd_leito}`,
            SN_VIP: sn_vip,
            CD_ATENDIMENTO: data.nr_attendance,
            CD_PACIENTE: cd_paciente,
            NM_PACIENTE: nm_paciente,
            CD_CONVENIO: cd_convenio,
            NM_CONVENIO: nm_convenio,
            DT_NASCIMENTO: dt_nascimento,
            TELEFONE: telefone,
            CD_SETOR: cd_setor,
            PREUCAUCAO: null
          }

          return dataTranslate
        }

        return null
      })
      .catch(function (err) { //error
        console.error('Axios: erro ao acessar o endpoint MV')
        console.error(err)
        return null
      });

    return ret

  }

  public async dataMv(data: IApiMV) {
    const url = `${data.url}/${data.nr_attendance}/${data.token}`

    const ret = Axios.get(url)
      .then(function (response: any) {
        let status = response.data.message.status

        if (status == 200){
          const {
            convenio: { cd_convenio, nm_convenio },
            setor: { cd_setor },
            leito: { cd_leito },
          } = response.data.message.Body.atendimento

          const {
            sn_vip,
            cd_paciente,
            nm_paciente,
            dt_nascimento,
            telefone
          } = response.data.message.Body.paciente

          let dataTranslate = {
            CD_SETOR_LEITO: `${cd_setor}-${cd_leito}`,
            SN_VIP: sn_vip,
            CD_ATENDIMENTO: data.nr_attendance,
            CD_PACIENTE: cd_paciente,
            NM_PACIENTE: nm_paciente,
            CD_CONVENIO: cd_convenio,
            NM_CONVENIO: nm_convenio,
            DT_NASCIMENTO: dt_nascimento,
            TELEFONE: telefone,
            CD_SETOR: cd_setor,
            PREUCAUCAO: null
          }

          return dataTranslate
        }

        return null
      })
      .catch(function () { //error
        console.error('Axios: erro ao acessar o endpoint')
        return null
      });

    return ret

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
