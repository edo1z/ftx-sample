const request = require('./apiRequest')

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

exports.modifyOrder = async (orderId, data) => {
  const path = '/orders/' + orderId + '/modify'
  return await request('POST', path, data, true)
}

exports.cancelOrder = async (orderId) => {
  const path = '/orders/' + orderId
  return await request('DELETE', path, null, true)
}

exports.cancelAllOrders = async () => {
  return await request('DELETE', '/orders', null, true)
}

exports.positions = async () => {
  request('GET', '/positions', null, true)
}

_error = (err, exit = false) => {
  const res = err.response
  console.log(`[${res.status} - ${res.statusText}] ${res.data.error}`)
  if (exit) process.exit(1)
}
exports.error = (err) => _error(err)
exports.errorExit = (err) => _error(err, true)
