const ftx = require('./ftx/apiClient')
const conf = require('./config/index')
const Log = require('./logs/index')
const { connect } = require('./ftx/webSocketClient')
const { init: initStatus, statuses } = require('./statuses')
const { init: initOrder, setOrder, noOrder } = require('./data/order')
const { init: initPosi, noPosi } = require('./data/position')
const { init: initTick, setTick } = require('./data/tick')
const { init: initFill, setFill } = require('./data/fill')
const { canOrder } = require('./rules/order')
const {canCounterOrder, canModifyCounterOrder} = require('./rules/counterOrder')
const { order } = require('./actions/order')
const { counterOrder, modifyCounterOrders } = require('./actions/counterOrder')
const { canCancelOrder} = require('./rules/cancel')
const {cancelOrders} = require('./actions/cancel')

const main = async () => {
  _init()
  _subscribe()
}

const _init = () => {
  initStatus(conf.markets)
  initOrder(conf.markets)
  initFill(conf.markets)
  initPosi(conf.markets)
  initTick(conf.markets)
}

const _subscribe = () => {
  let subscriptions = [
    { channel: 'orders', market: null },
    { channel: 'fills', market: null },
  ]
  conf.markets.forEach((market) => {
    subscriptions.push({ channel: 'ticker', market: market })
  })
  connect({
    subscriptions: subscriptions,
    onmessage: _onMessage,
  })
}

const _onMessage = async (data) => {
  if (data.type !== 'update') return console.log(data)
  if (data.channel === 'ticker') _onTick(data)
  else if (data.channel === 'orders') _onOrder(data)
  else if (data.channel === 'fills') _onFill(data)
}

const _onTick = async (data) => {
  setTick(data.market, data.data)
  await _actionsOnTick(data.market, data.data)
}

const _onOrder = (data) => {
  setOrder(data.data)
}

const _onFill = async (data) => {
  Log.fill.fill(data.data)
  Log.profit.fill(data.data)
  setFill(data.data)
  Log.position.now(data.data.market)
  _actionsOnFill(data.data)
}

const _actionsOnTick = async (market, data) => {
  if (statuses[market].onTick.wait) return
  statuses[market].onTick.wait = true
  await __actionsOnTick(market, data)
  statuses[market].onTick.wait = false
}

const __actionsOnTick = async (market, data) => {
  // order
  if (noPosi(market) && noOrder(market)) {
    const orderInfo = canOrder(market, data)
    if (orderInfo) return await order(orderInfo)
  }

  // cancel order
  const pastOrders = canCancelOrder(market)
  console.log('cancel order ==> ', pastOrders)
  if (pastOrders) return await cancelOrders(pastOrders)

  // cancel counter order
  const counterOrderInfo = canModifyCounterOrder(market)
  console.log('cancel counter order ==> ', counterOrderInfo)
  if (counterOrderInfo) return await modifyCounterOrders(counterOrderInfo)

  // // StopLoss - stoploss rule && not stoping
  // if (stopLossRule() && notStopping()) return await _stopLoss()
}

const _actionsOnFill = async (data) => {
  const orderInfo = canCounterOrder(data)
  if (!orderInfo) return
  counterOrder(orderInfo)
}

main()
