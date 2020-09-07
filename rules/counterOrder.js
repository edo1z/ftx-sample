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
  let targetProfit = conf.amountPerTransaction * conf.minProfitRate

  // TODO Fix  (for ETH only)
  targetProfit = Math.round(targetProfit * 100) / 100
  console.log(targetProfit)
  if (targetProfit <= 0) targetProfit = 0.01
  console.log('targetp', targetProfit)

  let price
  if (side === 'buy') {
    price = data.price - targetProfit
  } else {
    price = data.price + targetProfit
  }
  console.log('counterOrderInfo: side:', side, ' fillPricel:', data.price, ' price:', price, ' size:', data.size)
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
