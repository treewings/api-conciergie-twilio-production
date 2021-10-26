import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import MessageModel from 'App/Models/Message'

export default class MessageSeederSeeder extends BaseSeeder {
  public async run () {
    await MessageModel.truncate(true)

    await MessageModel.createMany([
      {
        description: 'Olá, \n\n Eu serei sua Concierge Digital durante sua permanência no Real Hospital Português. Estarei sempre à disposição para atender suas solicitações.\n\nPara que eu possa te atender melhor, por favor informe o seu número de atendimento. Você pode encontrá-lo na pulseira de identificação do paciente.',
        cd_message: 'init',
      },
      {
        description: 'Olá, \n\n Você acessou o canal do *Concierge Digital* do Real Hospital Português.\n\n Verifiquei que o número de atendimento informado é inválido.\n\nPara que eu possa te atender melhor, por favor informe o número de atendimento que se encontra na pulseira de identificação do paciente.',
        cd_message: 'lobby_attendance_not_found',
      },
      {
        description: 'Ops! O número informado não é um número de atendimento válido. \n\nPor favor, tente novamente.',
        cd_message: 'attendance_invalid',
      },
      {
        description: 'Dei uma conferida aqui e não conseguimos validar sua opção. Por favor, tente novamente.',
        cd_message: 'option_invalid',
      },
      {
        description: 'Ops! Ocorreu um erro. Por favor, tente novamente..',
        cd_message: 'error',
      },
      {
        description: 'Para que eu possa direcionar melhor o atendimento, por favor me informe se o pedido é para: \n\n *1* - Paciente\n *2* - Acompanhante',
        cd_message: 'pac_acomp',
      },
      {
        description: 'Certo, você escolheu: ',
        cd_message: 'quantity',
      },
      {
        description: 'Anotei tudo! 👩‍💻 \nVocê deseja solicitar mais algum serviço? \n\n *1* - Sim \n *2* - Não, concluir pedido',
        cd_message: 'more_service',
      },
      {
        description: 'Para confirmar o pedido, digite: \n *1* - Sim\n *2* - Não, descartar pedido',
        cd_message: 'confirm_end_service',
      },
      {
        description: 'Perfeito, pedido enviado.\n\nCaso queria fazer um novo pedido, basta selecionar uma das opções abaixo: \n\n ',
        cd_message: 'end_service',
      },
      {
        description: 'Seu pedido foi descartado, mas você pode me chamar novamente selecionando uma das opções abaixo: \n\n',
        cd_message: 'cancel_service',
      },
      {
        description: 'É um prazer te atender. \nO que você deseja que eu faça por você?\n\n',
        cd_message: 'submenu',
      },
      {
        description: 'Ops! O número informado não é um número de atendimento válido. \n\nPor favor, tente novamente.',
        cd_message: 'attendance_invalid',
      },
      {
        description: 'Obrigada! \n\n O atendimento por este canal é automático e suas solicitações serão atendidas através do menu de opções. Basta digitar o número da opção desejada:\n\n',
        cd_message: 'init_after_service',
      },
      {
        description: 'É um prazer te atender. \nO que você deseja que eu faça por você?\n\n',
        cd_message: 'main_menu',
      },
      {
        description: 'Verifiquei que o número de atendimento informado é inválido.\n\nPara que eu possa te atender melhor, por favor informe o número de atendimento que se encontra na pulseira de identificação do paciente.',
        cd_message: 'waiting_attendance_invalid',
      },
      {
        description: 'Tá certo.\n\n Segue abaixo o pedido que eu anotei durante nossa conversa.\n Por favor, veja se está tudo correto. Assim que confirmar, enviarei para as áreas responsáveis para que atendam dentro do tempo estimado.\n',
        cd_message: 'title_summary',
      },

    ])
  }
}
