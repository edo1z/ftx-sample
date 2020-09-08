const conf = require('../config/index')
const { latest } = require('../data/tick')
const { getOrderCategory, getPastOrders, getAllByOrderCategory, specifiedSize } = require('../data/order')
const { sizeIncrement, priceIncrement } = require('../data/market')
const { calcProfit } = require('../data/position')

exports.canCounterOrder = (data) => {
  const orderCategory = getOrderCategory(data.market, data.orderId)
  if (orderCategory != 'order') return null
  if (data.size < sizeIncrement(data.market)) {
    console.log('you can counterOrder. but, size it too small.', data.size, sizeIncrement(data.market))
    return null
  }
  return _counterOrderInfo(data)
}

const _counterOrderInfo = (fillData) => {
  const market = fillData.market
  const side = fillData.side === 'buy' ? 'sell' : 'buy'
  let targetProfit = conf.amountPerTransaction * conf.minProfitRate / specifiedSize(market, side)
  if (targetProfit < priceIncrement(market)) {
    targetProfit = priceIncrement(market)
  }
  let price
  if (side === 'buy') {
    price = fillData.price - targetProfit
    const bidPrice = latest(market).bid
    if (bidPrice < price) price = bidPrice
  } else {
    price = fillData.price + targetProfit
    const askPrice = latest(market).ask
    if (askPrice > price) price = askPrice
  }
  console.log('counterOrderInfo: side:', side, ' fillPricel:', fillData.price, ' price:', price, ' size:', fillData.size)
  return {
    side: side,
    market: market,
    price: price,
    size: fillData.size,
  }
}

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
    const _orderInfo = _modifyCounterOrderIndo(market, order)
    if (_orderInfo) orderInfo.push(_orderInfo)
  })
  return orderInfo
}

const _canModifyCounterOrderWithLossRate = (market) => {
  const orders = getAllByOrderCategory(market, 'counterOrder')
  if (!orders || orders.length === 0) return null
  const orderInfo = []
  orders.forEach((order) => {
    const _orderInfo = _modifyCounterOrderIndo(market, order)
    if (_orderInfo) orderInfo.push(_orderInfo)
  })
  return orderInfo
}

const _modifyCounterOrderIndo = (market, data) => {
  const nextPrice =
    data.side === 'buy' ? latest(market).bid : latest(market).ask
  if (
    (data.side === 'buy' && nextPrice > data.price) ||
    (data.side === 'ask' && nextPrice < data.price)
  ) {
    return { id: data.id, data: { price: nextPrice } }
  }
  return null
}
