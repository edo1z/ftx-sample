const conf = require('./config/index')
const Log = require('./logs/index')
const { connect } = require('./ftx/webSocketClient')
const { init: initStatus } = require('./statuses')
const { init: initActions } = require('./actions/index')
const { init: initOrder, setOrder } = require('./data/order')
const { init: initPosi } = require('./data/position')
const { init: initTick, setTick } = require('./data/tick')
const { init: initFill, setFill } = require('./data/fill')
const { canCounterOrder } = require('./rules/counterOrder')
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
  initActions(conf.markets)
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

const _actionsOnFill = async (data) => {
  const orderInfo = canCounterOrder(data)
  if (!orderInfo) return
  counterOrder(orderInfo)
}

main()
