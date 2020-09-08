const conf = require('../config/index')
const { totalSize, latest } = require('../data/tick')
const { specifiedSize } = require('../data/order')

exports.canOrder = (market) => {
  const tick = latest(market)
  const spreadRate = (tick.ask - tick.bid) / tick.last
  const size = totalSize(market)
  const tradeAmountDiff = (size.bidSize - size.askSize) * tick.last
  if (
    tradeAmountDiff * -1 > conf.minTradeAmountDiff &&
    spreadRate < conf.maxSpreadRate
  ) {
    return _orderInfo(market, tick, 'ask')
  } else if (
    tradeAmountDiff > conf.minTradeAmountDiff &&
    spreadRate < conf.maxSpreadRate
  ) {
    return _orderInfo(market, tick, 'bid')
  }
  return null
}

const _orderInfo = (market, data, side) => {
  const price = side === 'ask' ? data.ask : data.bid
  const size = specifiedSize(market, side)
  return {
    side: side === 'ask' ? 'sell' : 'buy',
    market: market,
    price: price,
    type: 'limit',
    size: size,
  }
}
