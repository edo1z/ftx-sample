const ftx = require('../ftx/apiClient')
const err = require('../error/error')
const { setPosiFromApi } = require('./position')
// const { setOrdersFromApi } = require('./orders')

const timeInterval = 1000

exports.init = (markets) => {
  markets.forEach((market) => _dataLoop(market))
}

const _dataLoop = async (market) => {
  await __dataLoop(market)
  setTimeout(() => _dataLoop(market), timeInterval)
}

const __dataLoop = async (market) => {
  const positions = await ftx.getPositions().catch(err)
  setPosiFromApi(positions.data.result)
  // const orders = await ftx.getOpenOrders().catch(err)
  // setOrdersFromApi(orders)
  // fill
}
