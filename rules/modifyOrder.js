const conf = require('../config/index')
const { latest } = require('../data/tick')
const { getPastOrders, getAllByOrderCategory } = require('../data/order')
const { calcProfit } = require('../data/position')

exports.canModifyCounterOrder = (market) => {
  const profit = calcProfit(market)
  if (!profit) return null
  if (profit.profitRate >= -1 * conf.maxLossRateOfModifyOrder) {
    return _canModifyCounterOrderWithTimeOver(market)
  } else {
    return _canModifyCounterOrderWithLossRate(market)
  }
}

const _canModifyCounterOrderWithTimeOver = (market) => {
  const timeLimit = conf.counterOrderTimeLimit
  const pastCounterOrders = getPastOrders(
    market,
    timeLimit * 1000,
    'counterOrder',
  )
  if (!pastCounterOrders || pastCounterOrders.length === 0) return null
  const orderInfo = []
  pastCounterOrders.forEach((order) => {
    const _orderInfo = _modifyCounterOrderInfo(market, order)
    if (_orderInfo) orderInfo.push(_orderInfo)
  })
  console.log('Modify by TimeOver', orderInfo)
  return orderInfo
}

const _canModifyCounterOrderWithLossRate = (market) => {
  const orders = getAllByOrderCategory(market, 'counterOrder')
  if (!orders || orders.length === 0) return null
  const orderInfo = []
  orders.forEach((order) => {
    const _orderInfo = _modifyCounterOrderInfo(market, order)
    if (_orderInfo) orderInfo.push(_orderInfo)
  })
  console.log('Modify by LossRate', orderInfo)
  return orderInfo
}

const _modifyCounterOrderInfo = (market, data) => {
  const nextPrice =
    data.side === 'buy' ? latest(market).bid : latest(market).ask
  if (
    (data.side === 'buy' && nextPrice > data.price) ||
    (data.side === 'sell' && nextPrice < data.price)
  ) {
    return { id: data.id, data: { price: nextPrice }, market: market }
  }
  return null
}
