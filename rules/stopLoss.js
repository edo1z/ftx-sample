const conf = require('../config/index')
const { calcProfit, posi } = require('../data/position')
const {latest} = require('../data/tick')

exports.canStopLoss = (market) => {
  const profit = calcProfit(market)
  const last = latest(market).last
  if (profit.priceRange < 0) {
    if(Math.abs(profit.priceRange) / last > conf.maxLossRate) {
      return _orderInfo(market)
    }
  }
  return null
}

const _orderInfo = (market) => {
  const position = posi(market)
  return {
    market: market,
    side: position.side === 'buy'  ? 'sell' : 'buy',
    price: null,
    type: 'market',
    size: position.size
  }
}
