const ftx = require('../ftx/apiClient')

const positions = {}

const init = (markets) => {
  markets.forEach(
    (market) =>
      (positions[market] = { side: null, size: 0, price: 0, profit: 0 }),
  )
}

const _init = (market) =>
  (positions[market] = { side: null, size: 0, price: 0, profit: 0 })

const isPosi = (market) => positions[market].size > 0
const noPosi = (market) => positions[market].size <= 0

exports.setPosi = (data, orderType) => {
  switch (orderType) {
    case 'order':
      _addToPosition(data)
      break
    case 'counterOrder':
      _displayProfit(data)
      _minusToPosition(data)
      break
    default:
      console.log('orderType is not set.')
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

exports.positions = positions
exports.isPosi = isPosi
exports.noPosi = noPosi
exports.init = init
