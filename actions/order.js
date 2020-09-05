const ftx = require('../ftx/apiClient')
const {setOrder} = require('../data/order')
const {sleep} = require('../utils/sleep')

exports.order = async (orderInfo) => {
  console.log('[order] Start')
  try {
    const result = await ftx.order(orderInfo).catch()
    setOrder(result.data.result, 'order')
    console.log('[order] Fin')
  } catch(e) {
    ftx.err(e)
    console.log('[order] Fail! SLEEP 1000 msec...')
    await sleep(1000)
  }
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
  console.log('counterOrder')
  const result = await ftx.order(orderInfo).catch(ftx.errorExit)
  console.log('counterOrder FIN')
  orderData.setOrder(result.data.result, 'counterOrder')
}

const _modifyOrders = async (market, orderIds) => {
  orderIds.forEach(async (orderId) => {
    console.log('cancel order for modify', orderId)
    await ftx.cancelOrder(orderId).catch(ftx.errorExit)
    console.log('cancel order for modify FIN', orderId)
    const order = orderData.orders[market][orderId]
    const side = order.data.side
    const price = side === 'buy' ?
      tickData.bidPrice(market) :
      tickData.askPrice(market)
    const orderInfo = {
      side: side,
      market: market,
      price: price,
      size: order.data.remainingSize
    }
    console.log('modify order', orderId)
    const result = await _counterOrder(orderInfo)
    console.log('modify order FIN', orderId)
  })
}
