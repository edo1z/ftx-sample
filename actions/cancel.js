const ftx = require('../ftx/apiClient')
const { err } = require('../error/error')
const { randomStr } = require('../utils/randomStr')

exports.cancelOrders = async (orders) => {
  const token = randomStr(15)
  await Promise.all(orders.map(order => {
    _cancelOrder(order.id, token)
  }))
}

const maxTryCountOfCancel = 10
const timeIntervalOfCancel = 3000

const _cancelOrder = async (orderId, token, tryCount = 1) => {
  if (tryCount > maxTryCountOfCancel) {
    console.log(
      `[Cancel] Exceeded maximum number of attempts for Cancel. orderId: ${orderId} token: ${token}`,
    )
    process.exit(1)
  }
  console.log(`[Cancel] try(${tryCount}). orderId: ${orderId} token: ${token}`)
  try {
    await ftx.cancelOrder(orderId)
    console.log(`[cancel][order] Success! orderId: ${orderId} token: ${token}`)
  } catch (e) {
    if(err(e) === 'Order already closed') return null
    console.log(`[Cancel] Fail! SLEEP ${timeIntervalOfCancel} msec... orderId: ${orderId} token: ${token}`)
    return new Promise(resolve => {
      setTimeout(async () => {
        const result = await _cancelOrder(orderId, token, ++tryCount)
        resolve(result)
      }, timeIntervalOfCancel)
    })
  }
}

exports.cancelAllOrders = async (market, token, tryCount = 1) => {
  if (tryCount > maxTryCountOfCancel) {
    console.log(
      `[CancelAll] Exceeded maximum number of attempts for Cancel. token: ${token}`,
    )
    process.exit(1)
  }
  const options = {
    market: market,
    limitOrdersOnly: true,
  }
  console.log(`[CancelAll] try(${tryCount}). token: ${token}`)
  try {
    await ftx.cancelAllOrders(options)
    console.log(`[cancelAll] Success! token: ${token}`)
  } catch (e) {
    err(e)
    console.log(`[CancelAll] Fail! SLEEP ${timeIntervalOfCancel} msec... token: ${token}`)
    return new Promise(resolve => {
      setTimeout(async () => {
        const result = await _cancelAllOrder(market, token, ++tryCount)
        resolve(result)
      }, timeIntervalOfCancel)
    })
  }
}

exports.cancelCounterOrders = async (orders) => {
  const token = randomStr(15)
  orders.forEach(async (order) => {
    await _cancelCounterOrder(order.id, token)
    console.log(`[cancel][counterOrder] Success! ${order.id} token: ${token}`)
  })
}

const maxTryCountOfCancelCounterOrder = 10
const timeIntervalOfCancelCounterOrder = 3000

const _cancelCounterOrder = async (orderId, token, tryCount = 1) => {
  if (tryCount > maxTryCountOfCancelCounterOrder) {
    console.log(
      `[Cancel][countOrder] Exceeded maximum number of attempts for Cancel. orderId: ${orderId} token: ${token}`,
    )
    process.exit(1)
  }
  console.log(`[Cancel][countOrder] try(${tryCount}). orderId: ${orderId} token: ${token}`)
  try {
    return await ftx.cancelOrder(orderId)
  } catch (e) {
    err(e)
    console.log(`[Cancel][counterOrder] Fail! SLEEP ${timeInterval} msec... . orderId: ${orderId} token: ${token}`)
    return new Promise(resolve => {
      setTimeout(async () => {
        const result = await _cancelCounterOrder(orderId, token, ++tryCount)
        resolve(result)
      }, timeIntervalOfCancelCounterOrder)
    })
  }
}

