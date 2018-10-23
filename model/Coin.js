const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'coins',
    // data: {
    //   type: Array,
    //   currency: {
    //     type: Object,
    //     default: '',
    //     price: {
    //       type: Number,
    //       default: ''
    //     }
    //   }
  },
  coins: {
    type: Object
  },
  date: {
    type: Date
  },
  price: {
    type: Array,
    sek: {
      Type: Number
    },
    eur: {
      Type: Number
    },
    usd: {
      Type: Number
    }
  }


});

module.exports = mongoose.model('Coin', coinSchema)

