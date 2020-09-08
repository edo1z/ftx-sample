const { latest } = require('../data/tick')
const conf = require('../config/index')
const Log = require('../logs/index')
const positions = {}

exports.init = (markets) => {
  markets.forEach(
    (market) =>
      (positions[market] = {
        side: null,
        size: 0,
        entryPrice: 0,
        profit: 0,
      }),
  )
}

const isPosi = (market) => positions[market].size > 0
const noPosi = (market) => positions[market].size <= 0
const posi = (market) => positions[market]

exports.setPosiFromApi = (data, markets) => {
  data.forEach((posi) => {
    if (markets.includes(posi.future)) {
      const oldPosi = Object.assign(positions[posi.future], {})
      positions[posi.future] = posi
      if (
        oldPosi.side != posi.side ||
        oldPosi.size != posi.size
      ) {
        Log.position.now(posi.future)
      }
    }
  })
}

exports.calcProfit = (market, side = null) => {
  if (noPosi(market)) return null
  const position = posi(market)
  const tick = latest(market)
  let nowPrice
  if (side === 'buy') {
    nowPrice = tick.bid
  } else if (side === 'sell') {
    nowPrice = tick.ask
  } else {
    nowPrice = tick.last
  }
  const priceRange =
    position.side === 'buy'
      ? nowPrice - position.entryPrice
      : position.entryPrice - nowPrice
  const profit = priceRange * position.size
  position.profit = profit
  const profitRate = profit / conf.amountPerTransaction
  return {
    priceRange: priceRange,
    profit: profit,
    profitRate: profitRate,
  }
}

exports.positions = positions
exports.isPosi = isPosi
exports.noPosi = noPosi
exports.posi = posi
