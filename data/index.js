const ftx = require('../ftx/apiClient')
const { err, errExit } = require('../error/error')
const { setPosiFromApi } = require('./position')
const { setMarkets } = require('./market')
// const { setOrdersFromApi } = require('./orders')

const timeInterval = 1000

exports.init = async (markets) => {
  _dataLoop(markets)
  // markets.forEach((market) => _dataLoopByMarket(market))
  await _getMarkets()
}

const _dataLoop = async (markets) => {
  await __dataLoop(markets)
  setTimeout(() => _dataLoop(markets), timeInterval)
}

const _dataLoopByMarket = async (market) => {}

const __dataLoop = async (markets) => {
  const positions = await ftx.getPositions().catch(err)
  setPosiFromApi(positions.data.result, markets)
  // const orders = await ftx.getOpenOrders().catch(err)
  // setOrdersFromApi(orders)
  // fill
}

const _getMarkets = async () => {
  const markets = await ftx.getMarkets().catch(errExit)
  setMarkets(markets.data.result)
}
