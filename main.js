const ftx = require('./ftx/apiClient')
const { connect } = require('./ftx/webSocketClient')
const conf = require('./config/index')
const { init: initOrder, noOrder } = require('./data/order')
const { init: initPosi, noPosi } = require('./data/position')
const { init: initTick, setTick } = require('./data/tick')
const statuses = require('./statuses')

const main = async () => {
  const nowOrders = await ftx.getOpenOrders('ETH-PERP').catch(ftx.err)
  console.log(nowOrders.data.result)
  // _init()
  // _subscribe()
}

const _init = () => {
  console.log(conf)
  statuses.init(conf.markets)
  initOrder(conf.markets)
  initPosi(conf.markets)
  initTick(conf.markets)
}

const _subscribe = () => {
  let subscriptions = [
    { channel: 'orders', market: null },
    { channel: 'fills', market: null },
  ]
  targetMarkets.forEach((market) => {
    subscriptions.push({ channel: 'ticker', market: market })
  })
  connect({
    subscriptions: subscriptions,
    onmessage: _onMessage,
  })
}

const _onMessage = async (data) => {
  if (data.type !== 'update') return console.log(data)
  if (data.channel === 'ticker') await _onTick(data)
  else if (data.channel === 'orders') _onOrder(data)
  else if (data.channel === 'fills') _onFill(data)
}

const _onTick = async (data) => {
  setTick(data.market, data.data)
  _actionsOnTick(data.market, data.data)
}

const _onOrder = (data) => {
  // orderData.setOrder(data.data)
}

const _onFill = async (data) => {
  // positionData.setFill(data.data)
  // _actionsOnFill(data)
}

const _actionsOnTick = async (market, data) => {
  if (statuses[market].onTick.wait) return
  statuses[market].onTick.wait = true
  await __actionsOnTick(market, data)
  statuses[market].onTick.wait = false
}

const _actionsOnFill = async (market, data) => {
  if (statuses[market].onFill.wait) return
  statuses[market].onFill.wait = true
  await __actionsOnFill(market, data)
  statuses[market].onFill.wait = false
}

const orderRule = () => {
  return false
}

const _order = () => {
  console.log('order!')
  process.exit(0)
  newPromise((resolve) => setTimeout(resolve, 500))
}

const __actionsOnTick = async (market, data) => {
  // order - no posi && no order
  if (noPosi() && noOrder() && orderRule()) return await _order()

  // cancelOrdre - cancel rule && not canceling
  // if (cancelRule('order') && notCanceling('counterOrder'))
  //   return await _cancelOrder()

  // // cancelCounterOrder - cancelCounterOrderRule && not cancelingCounterOrder
  // if (cancelRule('counterOrder') && notCanceling('counterOrder'))
  //   return await cancelCounterOrder()

  // // StopLoss - stoploss rule && not stoping
  // if (stopLossRule() && notStopping()) return await _stopLoss()
}

const __actionsOnFill = async (market, data) => {
  // counterOrder
  // if (canCounterOrder()) counterOrder()
}

main()
