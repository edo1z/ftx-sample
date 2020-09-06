const conf = require('../config/index')
const { latest } = require('../data/tick')
const { getOrderCategory, getPastOrders } = require('../data/order')

exports.canCounterOrder = (data) => {
  const orderCategory = getOrderCategory(data.market, data.orderId)
  if (orderCategory != 'order') return null
  return _counterOrderInfo(data)
}

const _counterOrderInfo = (data) => {
  const market = data.market
  const side = data.side === 'buy' ? 'sell' : 'buy'
  let targetProfit = latest(market).last * conf.minProfitRate
  if (side === 'buy') targetProfit *= -1
  const price = data.price + targetProfit
  return {
    side: side,
    market: market,
    price: price,
    size: data.size,
  }
}

exports.canModifyCounterOrder = (market) => {
  const timeLimit = conf.counterOrderTimeLimit
  const pastCounterOrders = getPastOrders(
    market,
    timeLimit * 1000,
    'counterOrder',
  )
  if (!pastCounterOrders || pastCounterOrders.length === 0) return null
  const orderInfo = []
  pastCounterOrders.forEach((order) => {
    const _orderInfo = _modifyCounterOrderIndo(market, order)
    if (_orderInfo) orderInfo.push(_orderInfo)
  })
  return orderInfo
}

const _modifyCounterOrderIndo = (market, data) => {
  const nextPrice =
    data.side === 'buy' ? latest(market).bid : latest(market).ask
  if (
    (data.side === 'buy' && nextPrice > data.price) ||
    (data.side === 'ask' && nextPrice < data.price)
  ) {
    return { id: data.id, data: { price: nextPrice } }
  }
  return null
}
