export default class Icons {
    async default(data: any) {
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

module.exports = Icons
