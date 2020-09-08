const ftx = require('../ftx/apiClient')
const { err } = require('../error/error')
const { setOrder, closeById } = require('../data/order')
const { randomStr } = require('../utils/randomStr')

exports.modifyCounterOrders = async (orderInfo) => {
  const token = randomStr(15)
  orderInfo.forEach(async (data) => {
    const result = await _modifyCounterOrder(data, token)
    const order = result.data.result
    closeById(data.market, data.id)
    setOrder(order, 'counterOrder')
    console.log(
      `[Modify][counterOrder] Success! new orderId: ${order.id} token: ${token}`,
    )
  })
}

const maxTryCountOfModifyCounterOrder = 10
const timeIntervalOfModifyCounterOrder = 3000

const _modifyCounterOrder = async (data, token, tryCount = 1) => {
  if (tryCount > maxTryCountOfModifyCounterOrder) {
    console.log(
      `[Modify][countOrder] Exceeded maximum number of attempts for Cancel. orderId: ${data.id} token: ${token}`,
    )
    process.exit(1)
  }
  console.log(
    `[Modify][countOrder] try(${tryCount}). side:`, ' price:', data.data.price, `orderId: ${data.id} token: ${token}`,
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
