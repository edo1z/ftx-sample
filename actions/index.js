const { canOrder } = require('../rules/order')
const { order } = require('./order')
const { canCancelOrder } = require('../rules/cancel')
const { canStopLoss } = require('../rules/stopLoss')
const { cancelOrders } = require('./cancel')
const { noPosi, isPosi } = require('../data/position')
const { noOrder } = require('../data/order')
const { isTickEmpty } = require('../data/tick')
const { stopLoss } = require('./stopLoss')
const { canModifyCounterOrder } = require('../rules/counterOrder')
const { modifyCounterOrders } = require('../actions/counterOrder')
const {isWaiting, setWait} = require('../data/statuses')
const { sleep } = require('../utils/sleep')

const timeInterval = 500

exports.init = (markets) => {
  markets.forEach((market) => _actionsLoop(market))
}

const _actionsLoop = async (market) => {
  await __actionLoop(market)
  setTimeout(() => _actionsLoop(market), timeInterval)
}

const __actionLoop = async (market) => {
  if (isTickEmpty(market)) return
  if (isPosi(market) || noOrder(market) || isWaiting(market, 'cancel')) {
    setWait(market, 'cancel', false)
  }

  // order
  if (noPosi(market) && noOrder(market)) {
    const orderInfo = canOrder(market)
    if (orderInfo) {
      return await order(orderInfo)
    }
  }

  // cancel order
  if(!isWaiting(market, 'cancel')) {
    const pastOrders = canCancelOrder(market)
    if (pastOrders) {
      setWait(market, 'cancel', true)
      return await cancelOrders(pastOrders)
    }
  }

  // stop loss
  if (!isWaiting(market, 'stopLoss') && !isWaiting(market, 'modifyOrder')) {
    const stopLossOrderInfo = canStopLoss(market)
    if (stopLossOrderInfo) {
      setWait(market, 'stopLoss', true)
      await stopLoss(market, stopLossOrderInfo)
      await sleep(3000)
      return setWait(market, 'stopLoss', false)
    }
  }

  // modify counter order
  // もし重複するなら、modifyOrder成功時に前の注文を手動closeさせる
  if (!isWaiting(market, 'modifyOrder') && !isWaiting(market, 'stopLoss')) {
    const counterOrderInfo = canModifyCounterOrder(market)
    if (counterOrderInfo) {
      setWait(market, 'modifyOrder', true)
      await modifyCounterOrders(counterOrderInfo)
      await sleep(2000)
      return setWait(market, 'modifyOrder', false)
    }
  }
}
