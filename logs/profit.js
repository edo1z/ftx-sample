const { posi } = require('../data/position')
const { getOrderCategory } = require('../data/order')
const conf = require('../config/index')

exports.fill = (fillData) => {
  const market = fillData.market
  const orderCategory = getOrderCategory(market, fillData.orderId)
  if (orderCategory != 'counterOrder') return
  const position = posi(market)
  let priceRange
  let profit
  if (position.side === 'buy') {
    priceRange = fillData.price - position.entryPrice
    profit = priceRange * fillData.size
  } else {
    priceRange = position.entryPrice - fillData.price
    profit = priceRange * fillData.size
  }
  const profitRate = priceRange / conf.amountPerTransaction
  console.log(
    `[${fillData.market}][PROFIT] SIDE: ${position.side} IN:`,
    position.entryPrice,
    ` OUT:`,
    fillData.price,
    ` SIZE:`,
    fillData.size,
    ` PROFIT:`,
    profit.toFixed(5),
    `PRICERANGE: `,
    priceRange.toFixed(5),
    `profitRate: `,
    profitRate.toFixed(5),
  )
}
