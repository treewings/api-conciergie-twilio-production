export interface IXmlSingleRequest{
  schedule: {
    image: {
      id: number
      description: string
      mediaType: number
      publicUrl: string
      status: number
    }
    serviceLocal: {
      alternativeIdentifier: string | null
    }
    team:{
      alternativeIdentifier: string
    }
    activitiesOrigin: number
    teamExecution: number
    date: string
    hour: string
    activityRelationship:  [
      activity: {
        alternativeIdentifier: string
      },
    ]
    observation: string
    priority: number
    customFields: {
      'uni.ds_unid_destino': string | null
      'uni.ds.unid_local_destino': string | null
      'uni.cd_unid_destino': string | null
      'uni.cd.unid_local_destino': string | null
      'pac.cd_paciente': string | null
      'pac.nm_paciente': string | null
      'pac.sn_vip': string | null
      'con.cd_convenio': string | null
      'con.nm_convenio': string | null
      'usr.cd_login': string
      'tarefa.desc': string
      'pac.cd_atendimento': string | null
      'pac.dt_nascimento': string | null
      'tarefa.classif': string | null
      'cmp.nm_solic': string
      'tsk.concierge_para_paciente': string | null
      'tsk.concierge_quantidade': string
    }
  }
}

export interface IXmlSingleRequestItens{

}


