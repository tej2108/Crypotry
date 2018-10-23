const cron = require('node-schedule');
const fetch = require('node-fetch');
const Coin = require('../model/Coin')

const axios = require('axios')
const CUR_API = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,ALT,IOT&tsyms=SEK,EUR,USD'

module.exports = async socket => {
  try {
    const res = await axios.get(CUR_API);
    console.log('coin data', res.data)
    socket.emit("coins", res.data);
  } catch (err) {
    console.error(`Error: ${error.code}`)
  }
}
