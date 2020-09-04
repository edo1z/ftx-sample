const orderData = require('./orderData')

const positions = {}

const init = (markets) => {
  markets.forEach(
    (market) =>
      (positions[market] = { side: null, size: 0, price: 0, profit: 0 }),
  )
}

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

const _displayFill = data => {
  console.log(`- [${data.market}][Fill] ${data.side} ${data.price} ${data.size} - FEE: ${data.fee}`)
}

const _addToPosition = (data) => {
  const position = positions[data.market]
  if (position.side && data.side != position.side) {
    console.log('fill side is not same position side.')
  }
  const price =
    (position.price * position.size + data.price * data.size) /
    (position.size + data.size)
  position.side = data.side
  position.size = position.size + data.size
  position.price = price
}

const _displayProfit = (data) => {
  const position = positions[data.market]
  let profit
  if (position.side === 'buy') {
    profit = (data.price - position.price) * data.size
  } else {
    profit = (position.price - data.price) * data.size
  }
  console.log(
    `[${data.market}][PROFIT] SIDE: ${position.side} IN: ${position.price} OUT: ${data.price} SIZE: ${data.size} PROFIT: ${profit}`,
  )
}

const _minusToPosition = (data) => {
  const position = positions[data.market]
  const size = position.size - data.size
  if (size <= 0) _init(data.market)
  else position.size = size
}

const profit = (market, nowPrice) => {
  const position = positions[market]
  if (position.size <= 0) return null
  let profit
  if(position.side === 'buy') {
    priceRange = nowPrice - position.price
  } else {
    priceRange = position.price - nowPrice
  }
  profit = priceRange * position.size
  position.profit = profit
  return {priceRange: priceRange, profit: profit}
}

exports.positions = positions
exports.init = init
exports.setFill = setFill
exports.profit = profit
