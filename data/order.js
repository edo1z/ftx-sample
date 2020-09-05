const moment = require('moment')
const ftx = require('../ftx/apiClient')

const maxOrderNumber = 50
const maxSaveMin = 30
const orders = {}

const init = (markets) => {
  markets.forEach((market) => {
    orders[market] = {}
    // getOpenOrders(market)
  })
}

const getOpenOrders = async (market) => {
  const res = await ftx.getOpenOrders(market).catch(ftx.err)
  orders[market] = res.data.result
  setTimeout(getOpenOrders, 1000)
}

const noOrder = market => (_orderNumber(market) <= 0)

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
const setWaiting = (market, id) => (orders[market][id].waiting = true)

exports.orders = orders
exports.init = init
exports.getOpenOrders = getOpenOrders
exports.setOrder = setOrder
exports.noOrder = noOrder
exports.isOpeningOrder = isOpeningOrder
exports.getOrderType = getOrderType
exports.setWaiting = setWaiting
