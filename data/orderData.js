const moment = require('moment')

const maxOrderNumber = 50
const maxSaveMin = 30
const orders = {}

const init = (markets) => {
  markets.forEach((market) => (orders[market] = {}))
}

const setOrder = (data, type = null) => {
  if (data.id in orders[data.market]) {
    const order = orders[data.market][data.id]
    order.data = data
    order.waiting = false
  } else {
    orders[data.market][data.id] = {
      type: type,
      data: data,
      createdAt: moment().format('x'),
      waiting: false,
    }
  }
  if (data.status === 'closed') _closed(data.market)
}

const _closed = (market) => {
  if (_shouldDeleteOrders(market)) _deleteOrders(market)
}

const _deleteOrders = (market) => {
  const tmpOrders = {}
  for (let key of Object.keys(orders[market])) {
    const order = orders[market][key]
    if (moment().diff(moment(order.createdAt, 'x')) < maxSaveMin * 60 * 1000) {
      tmpOrders[key] = order
    }
  }
  orders[market] = tmpOrders
}

const _shouldDeleteOrders = (market) => {
  return _orderNumber(market) > maxOrderNumber
}

const _orderNumber = (market) => {
  return Object.keys(orders[market]).length
}

const isOpeningOrder = (market) => {
  if (_orderNumber(market) <= 0) return false
  for (let key of Object.keys(orders[market])) {
    if (orders[market][key].data.status != 'closed') return true
  }
  return false
}

const getOrderType = (market, id) => orders[market][id].type

const shouldCancelOrders = (
  market,
  orderTimeLimit,
  counterOrderTimeLimit,
  shouldStopLoss,
) => {
  let orderIds = { order: [], counterOrder: [] }
  if (_orderNumber(market) <= 0) return orderIds
  for (let key of Object.keys(orders[market])) {
    const order = orders[market][key]
    if (order.data.status === 'closed') continue
    if (order.waiting) continue
    const timeLimit =
      order.type === 'order' ? orderTimeLimit : counterOrderTimeLimit
    if (
      (shouldStopLoss && order.type === 'counterOrder') ||
      moment().diff(moment(order.createdAt, 'x')) > timeLimit * 1000
    ) {
      orderIds[order.type].push(key)
      order.waiting = true
    }
  }
  return orderIds
}

const setWaiting = (market, id) => (orders[market][id].waiting = true)
const getSide = (market, id) => orders[market][id].data.side

exports.orders = orders
exports.init = init
exports.setOrder = setOrder
exports.isOpeningOrder = isOpeningOrder
exports.getOrderType = getOrderType
exports.shouldCancelOrders = shouldCancelOrders
exports.setWaiting = setWaiting
exports.getSide = getSide
