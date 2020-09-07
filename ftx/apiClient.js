const request = require('./apiRequest')

exports.getMarkets = async () => {
  return await request('GET', '/markets', null, false)
}

exports.getAllSubAccounts = async () => {
  return await request('GET', '/subaccounts', null, true)
}

exports.order = async (orderInfo) => {
  let order =  {
    market: orderInfo.market,
    side: orderInfo.side,
    price: orderInfo.price,
    type: orderInfo.type,
    size: orderInfo.size
  }
  if ('reduceOnly' in orderInfo) order.reduceOnly = orderInfo.reduceOnly
  if ('ioc' in orderInfo) order.ioc = orderInfo.ioc
  if ('postOnly' in orderInfo) order.postOnly = orderInfo.postOnly
  if ('clientId' in orderInfo) order.clientId = orderInfo.clientId
  return await request('POST', '/orders', order, true)
}

exports.getOpenOrders = async (market) => {
  const data = {market: market}
  return await request('GET', '/orders', data, true)
}

exports.getOrderHistory = async (market) => {
  const data = {market: market}
  return await request('GET', '/orders/history', data, true)
}

exports.getOrderStatus = async (orderId) => {
  const path = '/orders/' + orderId
  return await request('GET', path, null, true)
}

exports.modifyOrder = async (orderId, data) => {
  const path = '/orders/' + orderId + '/modify'
  return await request('POST', path, data, true)
}

exports.cancelOrder = async (orderId) => {
  const path = '/orders/' + orderId
  return await request('DELETE', path, null, true)
}

exports.cancelAllOrders = async (options = {}) => {
  return await request('DELETE', '/orders', options, true)
}

exports.getPositions = async () => {
  return await request('GET', '/positions', null, true)
}

exports.getFilss = async (market) => {
  const data = {market: market}
  return await request('GET', '/fills', data, true)
}
