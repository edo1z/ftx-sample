const { canOrder } = require('../rules/order')
const { canModifyCounterOrder } = require('../rules/counterOrder')
const { order } = require('./order')
const { modifyCounterOrders } = require('../actions/counterOrder')
const { canCancelOrder } = require('../rules/cancel')
const { cancelOrders } = require('./cancel')
const { noPosi } = require('../data/position')
const { noOrder } = require('../data/order')
const { isTickEmpty } = require('../data/tick')

const timeInterval = 300

exports.init = (markets) => {
  markets.forEach((market) => _actionsLoop(market))
}

const _actionsLoop = async (market) => {
  await __actionLoop(market)
  setTimeout(() => _actionsLoop(market), timeInterval)
}

const __actionLoop = async (market) => {
  if (isTickEmpty(market)) return

  // order
  if (noPosi(market) && noOrder(market)) {
    const orderInfo = canOrder(market)
    if (orderInfo) return await order(orderInfo)
  }

  // cancel order
  const pastOrders = canCancelOrder(market)
  if (pastOrders) return await cancelOrders(pastOrders)

  // cancel counter order
  const counterOrderInfo = canModifyCounterOrder(market)
  if (counterOrderInfo) return await modifyCounterOrders(counterOrderInfo)

  // // StopLoss - stoploss rule && not stoping
  // if (stopLossRule() && notStopping()) return await _stopLoss()
}
