const {posi} = require('../data/position')
const { getOrderCategory } = require('../data/order')

exports.fill = (fillData) => {
  const market = fillData.market
  const orderCategory = getOrderCategory(market, fillData.orderId)
  if (orderCategory != 'counterOrder') return
  const position = posi(market)
  let profit
  if (position.side === 'buy') {
    profit = (fillData.price - position.price) * fillData.size
  } else {
    profit = (position.price - fillData.price) * fillData.size
  }
  console.log(
    `[${fillData.market}][PROFIT] SIDE: ${position.side} IN: ${position.price} OUT: ${fillData.price} SIZE: ${fillData.size} PROFIT: ${profit}`,
  )
}
