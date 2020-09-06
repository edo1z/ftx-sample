const conf = require('../config/index')
const {getPastOrders} = require('../data/order')

exports.canCancelOrder = (market) => {
  const timeLimit = conf.orderTimeLimit
  const pastOrders = getPastOrders(market, timeLimit * 1000)
  if (!pastOrders || pastOrders.length === 0) return null
  return pastOrders
}

exports.canCancelCounterOrder = (market) => {
  const timeLimit = conf.counterOrderTimeLimit
  const pastCounterOrders = getPastOrders(market, timeLimit * 1000, 'counterOrder')
  if (!pastCounterOrders || pastCounterOrders.length === 0) return null
  return pastCounterOrders
}
