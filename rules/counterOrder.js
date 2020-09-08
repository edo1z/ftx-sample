const conf = require('../config/index')
const { latest } = require('../data/tick')
const { getOrderCategory, specifiedSize } = require('../data/order')
const { sizeIncrement, priceIncrement } = require('../data/market')

exports.canCounterOrder = (data) => {
  const orderCategory = getOrderCategory(data.market, data.orderId)
  if (orderCategory != 'order') return null
  if (data.size < sizeIncrement(data.market)) {
    console.log(
      'you can counterOrder. but, size it too small.',
      data.size,
      sizeIncrement(data.market),
    )
    return null
  }
  return _counterOrderInfo(data)
}

const _counterOrderInfo = (fillData) => {
  const market = fillData.market
  const side = fillData.side === 'buy' ? 'sell' : 'buy'
  let targetProfit =
    (conf.amountPerTransaction * conf.minProfitRate) /
    specifiedSize(market, side)
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
  console.log(
    'counterOrderInfo: side:',
    side,
    ' fillPricel:',
    fillData.price,
    ' price:',
    price,
    ' size:',
    fillData.size,
  )
  return {
    side: side,
    market: market,
    price: price,
    size: fillData.size,
  }
}
