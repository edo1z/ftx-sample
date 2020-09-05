const conf = require('../config/index')
const { totalSize } = require('../data/tick')
const { isOpeningOrder } = require('../data/order')

exports.canOrder = (market, data) => {
  const spreadRate = (data.ask - data.bid) / data.last
  const size = totalSize(market)
  const tradeAmountDiff = (size.bidSize - size.askSize) * data.last
  if (
    tradeAmountDiff * -1 > conf.minTradeAmountDiff &&
    spreadRate < conf.maxSpreadRate
  ) {
    if (!isOpeningOrder(market)) {
      return _orderInfo(market, data, 'ask')
    }
  } else if (
    tradeAmountDiff > conf.minTradeAmountDiff &&
    spreadRate < conf.maxSpreadRate
  ) {
    if (!isOpeningOrder(market)) {
      return _orderInfo(market, data, 'bid')
    }
  }
  return null
}

const _orderInfo = (market, data, side) => {
  const price = side === 'ask' ? data.ask : data.bid
  const size = Math.round((conf.amountPerTransaction / price) * 1000000) / 1000000
  return {
    side: side === 'ask' ? 'sell' : 'buy',
    market: market,
    price: price,
    type: 'limit',
    size: size,
  }
}
