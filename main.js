const ftx = require('./ftx/apiClient')
const conf = require('./config/index')
const Log = require('./logs/index')
const { init: initStatus, statuses } = require('./statuses')
const { connect } = require('./ftx/webSocketClient')
const { init: initOrder, setOrder, noOrder } = require('./data/order')
const { init: initPosi, noPosi } = require('./data/position')
const { init: initTick, setTick } = require('./data/tick')
const { init: initFill, setFill } = require('./data/fill')
const { canOrder } = require('./rules/order')
const {canCounterOrder} = require('./rules/counterOrder')
const { order } = require('./actions/order')
const { counterOrder } = require('./actions/counterOrder')

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
  setFill(data.data)
  Log.fill.fill(data.data)
  _actionsOnFill(data.data)
}

const _actionsOnTick = async (market, data) => {
  if (statuses[market].onTick.wait) return
  statuses[market].onTick.wait = true
  await __actionsOnTick(market, data)
  statuses[market].onTick.wait = false
}

const __actionsOnTick = async (market, data) => {
  if (noPosi(market) && noOrder(market)) {
    const orderInfo = canOrder(market, data)
    if (!orderInfo) return
    await order(orderInfo)
  }

  // cancelOrdre - cancel rule && not canceling
  // if (cancelRule('order') && notCanceling('counterOrder'))
  //   return await _cancelOrder()

  // // cancelCounterOrder - cancelCounterOrderRule && not cancelingCounterOrder
  // if (cancelRule('counterOrder') && notCanceling('counterOrder'))
  //   return await cancelCounterOrder()

  // // StopLoss - stoploss rule && not stoping
  // if (stopLossRule() && notStopping()) return await _stopLoss()
}

const _actionsOnFill = async (data) => {
  const orderInfo = canCounterOrder(data)
  if (!orderInfo) return
  counterOrder(orderInfo)
}

main()
