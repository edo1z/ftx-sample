const ftx = require('../ftx/apiClient')
const { err } = require('../error/error')
const { setOrder } = require('../data/order')
const { randomStr } = require('../utils/randomStr')

const maxTryCountOfCounterOrder = 10
const timeInterval = 3000

exports.counterOrder = async (orderInfo) => {
  const token = randomStr(15)
  const result = await _counterOrder(orderInfo, token)
  setOrder(result.data.result, 'counterOrder')
  console.log('[counterOrder] Success ' + token)
}

const _counterOrder = async (orderInfo, token, tryCount = 1) => {
  if (tryCount > maxTryCountOfCounterOrder) {
    console.log(
      `[counterOrder] Exceeded maximum number of attempts for CounterOrder ${token}`,
    )
    process.exit(1)
  }
  console.log(`[counterOrder] try(${tryCount}) ` + token)
  try {
    return await ftx.order(orderInfo)
  } catch (e) {
    err(e)
    console.log(`[counterOrder] Fail! SLEEP ${timeInterval} msec... ` + token)
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await _counterOrder(orderInfo, token, ++tryCount)
        resolve(result)
      }, timeInterval)
    })
  }
}

exports.modifyCounterOrders = async (orderInfo) => {
  const token = randomStr(15)
  orderInfo.forEach(async (data) => {
    await _modifyCounterOrder(data, token)
    console.log(
      `[Modify][counterOrder] Success! orderId: ${orderInfo.id} token: ${token}`,
    )
  })
}

const maxTryCountOfModifyCounterOrder = 10
const timeIntervalOfModifyCounterOrder = 3000

const _modifyCounterOrder = async (data, token, tryCount = 1) => {
  if (tryCount > maxTryCountOfModifyCounterOrder) {
    console.log(
      `[Modify][countOrder] Exceeded maximum number of attempts for Cancel. orderId: ${data.Id} token: ${token}`,
    )
    process.exit(1)
  }
  console.log(
    `[Modify][countOrder] try(${tryCount}). orderId: ${data.id} token: ${token}`,
  )
  try {
    return await ftx.modifyOrder(data.id, data.data)
  } catch (e) {
    err(e)
    console.log(
      `[Modify][counterOrder] Fail! SLEEP ${timeIntervalOfModifyCounterOrder} msec... . orderId: ${data.id} token: ${token}`,
    )
    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await _modifyCounterOrder(data, token, ++tryCount)
        resolve(result)
      }, timeIntervalOfModifyCounterOrder)
    })
  }
}
