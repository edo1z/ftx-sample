const conf = require('../config/index')
const { calcProfit, posi } = require('../data/position')

exports.canStopLoss = (market) => {
  const profit = calcProfit(market)
  if (profit.priceRange < 0) {
    const lossRate = Math.abs(profit.priceRange) / conf.amountPerTransaction
    if(lossRate > conf.maxLossRate) {
      console.log('stop loss... lossRate:', lossRate.toFixed(4), ' priceRange: ', profit.priceRange.toFixed(4), ' profit: ', profit.profit.toFixed(4))
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
