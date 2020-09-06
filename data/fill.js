const { getOrderType } = require('./order')
const { setPosi } = require('./position')

const maxFillLength = 30
const fills = {}

const init = (markets) => {
  markets.forEach((market) => (fills[market] = []))
}

exports.setFill = (data) => {
  const market = data.market
  data.orderType = getOrderType(market, data.orderId)
  fills[market].push(data)
  if (fills[market].length > maxFillLength) fills[market].shift()
  setPosi(data, data.orderType)
}

exports.fills = fills
exports.init = init
