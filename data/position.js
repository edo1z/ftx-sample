const { latest } = require('../data/tick')
const positions = {}

exports.init = (markets) => {
  markets.forEach(
    (market) =>
      (positions[market] = { side: null, openSize: 0, entryPrice: 0, profit: 0 }),
  )
}

const isPosi = (market) => positions[market].openSize > 0
const noPosi = (market) => positions[market].openSize <= 0
const posi = (market) => positions[market]

exports.setPosiFromApi = (data) => {
  data.forEach(posi => {
    positions[posi.future] = posi
  })
}

exports.calcProfit = (market) => {
  if (noPosi(market)) return 0
  const position = posi(market)
  const last = latest(market).last
  const priceRange =
    position.side === 'buy' ? last - position.entryPrice : position.entryPrice - last
  const profit = priceRange * position.openSize
  position.profit = profit
  return {
    priceRange: priceRange,
    profit: profit,
  }
}

exports.positions = positions
exports.isPosi = isPosi
exports.noPosi = noPosi
exports.posi = posi
