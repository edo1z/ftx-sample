const conf = require('../config/index')
const {lastPrice} = require('../data/tick')
const {getOrderCategory} = require('../data/order')

exports.canCounterOrder = (data) => {
  const orderCategory = getOrderCategory(data.market, data.orderId)
  if(orderCategory != 'order') return null
  return _counterOrderInfo(data)
}

const _counterOrderInfo = (data) => {
  const market = data.market
  const side = data.side === 'buy' ? 'sell' : 'buy'
  let targetProfit = lastPrice(market) * conf.minProfitRate
  if (side === 'buy') targetProfit *= -1
  const price = data.price + targetProfit
  return {
    side: side,
    market: market,
    price: price,
    size: data.size,
  }
}
