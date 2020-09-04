require('dotenv').config()
const WebSocket = require('ws')
const moment = require('moment')
const crypto = require('crypto')

const apiKey = process.env.API_KEY
const apiSecretKey = process.env.API_SECRET_KEY
const url = 'wss://ftx.com/ws'
let ws = null
let pongAt = null
let onmessageFunc = null
let pingInterval = null
let pingIntervalTime = 15000
let subscriptions = []
let subaccount = null

const connect = (config = null) => {
  init()
  if (config) {
    if ('subscriptions' in config) {
      subscriptions = config.subscriptions
    }
    if ('subaccount' in config) {
      subaccount = config.subaccount
    }
    if ('onmessage' in config) {
      onmessageFunc = config.onmessage
    }
  }
  ws = new WebSocket(url)
  ws.onopen = onopen
  ws.onmessage = onmessage
  ws.onerror = onerror
  ws.onclose = onclose
}

const init = () => {
  pongAt = null
  authenticated = false
}

const onopen = () => {
  console.log('ftc ws opened')
  pingInterval = setInterval(ping, pingIntervalTime)
  auth()
  subscribe()
}

const onmessage = (e) => {
  try {
    const data = JSON.parse(e.data)
    if (data.type === 'pong') {
      pongAt = moment()
    } else {
      onmessageFunc(data)
    }
  } catch (err) {
    return
  }
}

const onerror = (err) => {
  console.log('ftx ws error', err)
}

const onclose = () => {
  console.log('ftx ws closed')
  clearInterval(pingInterval)
  setTimeout(connect, 500)
}

const send = (data) => ws.send(JSON.stringify(data))

const ping = () => {
  if (pongAt) {
    if (moment().diff(pongAt) > pingIntervalTime + 500) {
      console.log('pong too late')
      ws.terminate()
    }
  }
  send({ op: 'ping' })
}

const auth = () => {
  const ts = Date.now()
  const sign = crypto
    .createHmac('sha256', apiSecretKey)
    .update(ts + 'websocket_login')
    .digest('hex')
  let message = {
    op: 'login',
    args: {
      key: apiKey,
      sign: sign,
      time: ts,
    },
  }
  if (subaccount) message.args.subaccount = subaccount
  send(message)
}

const subscribe = () => {
  subscriptions.forEach((sub) => {
    _subscribe(sub.channel, sub.market)
  })
}

const _subscribe = (channel, market = null) => {
  const message = {
    op: 'subscribe',
    channel: channel,
  }
  if (market) message.market = market
  if (ws.readyState !== WebSocket.OPEN) {
  }
  send(message)
}

exports.connect = connect
