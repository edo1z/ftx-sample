const { posi } = require('../data/position')

exports.now = (market) => {
  const position = posi(market)
  console.log(`[${market}][Posi] side: ${position.side} size: ${position.openSize} price: ${position.entryPrice}`)
}
