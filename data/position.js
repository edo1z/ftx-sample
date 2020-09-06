const { latest } = require('../data/tick')
const positions = {}

exports.init = (markets) => {
  markets.forEach(
    (market) =>
      (positions[market] = { side: null, size: 0, price: 0, profit: 0 }),
  )
}

const _init = (market) =>
  (positions[market] = { side: null, size: 0, price: 0, profit: 0 })

const isPosi = (market) => positions[market].size > 0
const noPosi = (market) => positions[market].size <= 0
const posi = (market) => positions[market]

exports.setPosi = (data, orderCategory) => {
  switch (orderCategory) {
    case 'order':
      _addToPosition(data)
      break
    case 'counterOrder':
      _minusToPosition(data)
      break
    default:
      console.log('orderCategory is not set.')
      process.exit(1)
  }
}

const _addToPosition = (data) => {
  const position = positions[data.market]
  if (position.side && data.side != position.side) {
    console.log('fill side is not same position side.', position, data)
  }
  const price =
    (position.price * position.size + data.price * data.size) /
    (position.size + data.size)
  position.side = data.side
  position.size = position.size + data.size
  position.price = price
}

const _minusToPosition = (data) => {
  const position = positions[data.market]
  const size = position.size - data.size
  if (size <= 0) console.log('minusToPosition', size)
  if (size <= 0) _init(data.market)
  else position.size = size
}

exports.calcProfit = (market) => {
  if (noPosi(market)) return 0
  const position = posi(market)
  const last = latest(market).last
  const priceRange =
    position.side === 'buy' ? last - position.price : position.price - last
  const profit = priceRange * position.size
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
