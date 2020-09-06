const maxOrderNumber = 50
const orders = {}

exports.init = (markets) => {
  markets.forEach((market) => (orders[market] = []))
}

exports.setOrder = (data, orderCategory = null) => {
  const market = data.market
  const idx = orders[market].findIndex(order => order.id === data.id)
  if (idx < 0) {
    data.orderCategory = orderCategory
    orders[market].push(data)
    if (orders[market].length > maxOrderNumber) orders[market].shift()
  } else {
    data.orderCategory = orders[market][idx].orderCategory
    orders[market][idx] = data
  }
}

exports.noOrder = market => {
  if (orders[market].length <= 0) return true
  return !(orders[market].find(order => order.status != 'closed'))
}

exports.getOrderCategory = (market, id) => {
  const order = orders[market].find(order => order.id === id)
  if (!order) return undefined
  return order.orderCategory
}

exports.orders = orders
