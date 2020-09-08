const conf = require('../config/index')
const { calcProfit, posi } = require('../data/position')
const { latest } = require('../data/tick')

exports.canStopLoss = (market) => {
  const profit = calcProfit(market)
  if (!profit) return null
  if (profit.profitRate >= -1 * conf.maxLossRate) return null
  console.log('stop loss... profitRate:', profit.profitRate.toFixed(4), ' priceRange: ', profit.priceRange.toFixed(4), ' profit: ', profit.profit.toFixed(4))
  return _orderInfo(market)
}

// orderType = market
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
