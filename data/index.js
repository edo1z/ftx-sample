const ftx = require('../ftx/apiClient')
const {err, errExit} = require('../error/error')
const { setPosiFromApi } = require('./position')
const { setMarkets } = require('./market')
// const { setOrdersFromApi } = require('./orders')

const timeInterval = 1000

exports.init = async (markets) => {
  // markets.forEach((market) => _dataLoop(market))
  await _getMarkets()
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

const _getMarkets = async () => {
  const markets = await ftx.getMarkets().catch(errExit)
  setMarkets(markets.data.result)
}
