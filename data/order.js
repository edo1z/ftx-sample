const moment = require('moment')
const maxOrderNumber = 50
const orders = {}

exports.init = (markets) => {
  markets.forEach((market) => (orders[market] = []))
}

exports.setOrder = (data, orderCategory = null) => {
  const market = data.market
  const idx = orders[market].findIndex((order) => order.id === data.id)
  if (idx < 0) {
    data.orderCategory = orderCategory
    orders[market].push(data)
    if (orders[market].length > maxOrderNumber) orders[market].shift()
  } else {
    data.orderCategory = orders[market][idx].orderCategory
    orders[market][idx] = data
  }
}

exports.noOrder = (market) => {
  if (orders[market].length <= 0) return true
  return !orders[market].find((order) => order.status != 'closed')
}

const getById = (market, id) => {
  return orders[market].find((order) => order.id === id)
}
exports.getById = getById

exports.getAllByOrderCategory = (market, orderCateogry) => {
  orders[market].filter((order) => order.orderCategory === orderCateogry)
}

exports.getOrderCategory = (market, id) => {
  const order = getById(market, id)
  if (!order) return undefined
  return order.orderCategory
}

exports.getPastOrders = (market, msec, orderCategory = 'order') => {
  return orders[market].filter((order) => {
    if (order.status === 'closed') return false
    if (order.orderCategory != orderCategory) return false
    return moment().diff(moment(order.createdAt)) > msec
  })
}

exports.orders = orders
