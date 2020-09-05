const orderData = require('./order')

const positions = {}

const init = (markets) => {
  markets.forEach(
    (market) =>
      (positions[market] = { side: null, size: 0, price: 0, profit: 0 }),
  )
  getPositions()
}

const getPositions = async () => {
  const nowPositions = await ftx.getPositions().catch(ftx.error)
  console.log('nowPositions', nowPositions)
  nowPositions.forEach(posi => positions[posi.future] = posi)
  setTimeout(getPositions, 1000)
}

const isPosi = (market) => positions[market].size > 0
const noPosi = (market) => positions[market].size <= 0

const _init = (market) =>
  (positions[market] = { side: null, size: 0, price: 0, profit: 0 })

const setFill = (data) => {
  _displayFill(data)
  const orderType = orderData.orders[data.market][data.orderId].type
  if (orderType === 'order') {
    _addToPosition(data)
  } else if (orderType === 'counterOrder') {
    _displayProfit(data)
    _minusToPosition(data)
  } else {
    console.log('orderType is not set.')
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

exports.getPositions = getPositions
exports.positions = positions
exports.isPosi = isPosi
exports.noPosi = noPosi
exports.init = init
exports.setFill = setFill
