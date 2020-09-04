const ftx = require('./ftx/apiClient')
const { connect } = require('./ftx/webSocketClient')
const orderData = require('./data/orderData')
const positionData = require('./data/positionData')
const tickData = require('./data/tickData')

const amountPerTransaction = 1
const minTradeAmountDiff = 1200000
const maxSpreadRate = 0.0005
const minProfitRate = 0.0005
const maxLossRate = 0.00025
const orderTimeLimit = 20
const counterOrderTimeLimit = 30
const targetMarkets = ['ETH-PERP']

let statuses = {
  order: { wait: false },
}

const main = async () => {
  _init()
  let subscriptions = [
    { channel: 'orders', market: null },
    { channel: 'fills', market: null },
  ]
  targetMarkets.forEach((market) => {
    subscriptions.push({ channel: 'ticker', market: market })
  })
  connect({
    subscriptions: subscriptions,
    onmessage: _onMessage,
  })
}

const _init = () => {
  orderData.init(targetMarkets)
  positionData.init(targetMarkets)
  tickData.init(targetMarkets)
}

const _onMessage = async (data) => {
  if (data.type !== 'update') return console.log(data)
  if (data.channel === 'ticker') await _ticker(data)
  else if (data.channel === 'orders') _orders(data)
  else if (data.channel === 'fills') _fills(data)
}

const _ticker = async (data) => {
  tickData.setTick(data.market, data.data)
  const shouldStopLoss = _shouldStopLoss(data.market)
  const orderIdsForCancel = orderData.shouldCancelOrders(
    data.market,
    orderTimeLimit,
    counterOrderTimeLimit,
    shouldStopLoss,
  )
  await _cancelOrders(orderIdsForCancel.order)
  await _modifyOrders(data.market, orderIdsForCancel.counterOrder)
  const orderInfo = _canOrder(data.market, data.data)
  if (orderInfo) await _order(orderInfo)
}

const _shouldStopLoss = (market) => {
  const nowPrice = tickData.lastPrice(market)
  const profit = positionData.profit(market, nowPrice)
  if (profit && profit.priceRange < 0) {
    if (Math.abs(profit.priceRange) / nowPrice > maxLossRate) {
      console.log('StopLoss')
      return true
    }
  }
  return false
}

const _orders = (data) => {
  orderData.setOrder(data.data)
}

const _fills = async (data) => {
  positionData.setFill(data.data)
  const orderType = orderData.getOrderType(data.data.market, data.data.orderId)
  if (orderType === 'order') {
    const orderInfo = _counterOrderInfo(data.data)
    await _counterOrder(orderInfo)
  }
}

const _cancelOrders = async (orderIds) => {
  orderIds.forEach(async (orderId) => {
    await ftx.cancelOrder(orderId).catch(ftx.errorExit)
  })
}

const _modifyOrders = async (market, orderIds) => {
  orderIds.forEach(async (orderId) => {
    const side = orderData.getSide(market, orderId)
    const newPrice =
      side === 'buy' ? tickData.bidPrice(market) : tickData.askPrice(market)
    const result = await ftx
      .modifyOrder(orderId, { price: newPrice })
      .catch(ftx.errorExit)
    orderData.setOrder(result.data.result, 'counterOrder')
  })
}

const _canOrder = (market, data) => {
  const spreadRate = (data.ask - data.bid) / data.last
  const totalSize = tickData.totalSize(market)
  const tradeAmountDiff = (totalSize.bidSize - totalSize.askSize) * data.last
  if (tradeAmountDiff * -1 > minTradeAmountDiff && spreadRate < maxSpreadRate) {
    if (!orderData.isOpeningOrder(market)) {
      return _orderInfo(market, data, 'ask')
    }
  } else if (
    tradeAmountDiff > minTradeAmountDiff &&
    spreadRate < maxSpreadRate
  ) {
    if (!orderData.isOpeningOrder(market)) {
      return _orderInfo(market, data, 'bid')
    }
  }
  return null
}

const _counterOrderInfo = (data) => {
  const side = data.side === 'buy' ? 'sell' : 'buy'
  const targetProfit = tickData.lastPrice(data.market) * minProfitRate
  const price =
    side === 'buy' ? data.price - targetProfit : data.price + targetProfit
  return {
    side: side,
    market: data.market,
    price: price,
    size: data.size,
  }
}

const _counterOrder = async (orderInfo) => {
  const result = await ftx.order(orderInfo).catch(ftx.errorExit)
  orderData.setOrder(result.data.result, 'counterOrder')
}

const _orderInfo = (market, data, side) => {
  const price = side === 'ask' ? data.ask : data.bid
  const size = Math.round((amountPerTransaction / price) * 1000000) / 1000000
  return {
    side: side === 'ask' ? 'sell' : 'buy',
    market: market,
    price: price,
    type: 'limit',
    size: size,
  }
}

const _order = async (orderInfo) => {
  if (statuses.order.wait) return
  statuses.order.wait = true
  const result = await ftx.order(orderInfo).catch(ftx.errorExit)
  orderData.setOrder(result.data.result, 'order')
  statuses.order.wait = false
}

main()
