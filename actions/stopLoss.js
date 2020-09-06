const ftx = require('../ftx/apiClient')
const { err } = require('../error/error')
const { randomStr } = require('../utils/randomStr')
const { setOrder } = require('../data/order')
const {cancelAllOrders} = require('./cancel')

exports.stopLoss = async (market, orderInfo) => {
  const token = randomStr(15)
  await cancelAllOrders(market, token)
  const result = await _stopLossOrder(market, orderInfo, token)
  console.log(`[StopLoss] Success! token: ${token}`)
  setOrder(result.data.result, 'counterOrder')
}

const maxTryCount = 10
const timeInterval = 3000

const _stopLossOrder = async (market, orderInfo, token, tryCount = 1) => {
  if (tryCount > maxTryCount) {
    console.log(
      `[StopLoss] Exceeded maximum number of attempts for Order. token: ${token}`,
    )
    process.exit(1)
  }
  console.log(`[StopLoss] try(${tryCount}). token: ${token}`)
  try {
    return await ftx.order(orderInfo)
  } catch (e) {
    err(e)
    console.log(`[StopLoss] Fail! SLEEP ${timeInterval} msec... token: ${token}`)
    return new Promise(resolve => {
      setTimeout(async () => {
        const result = await _stopLossOrder(market, orderInfo, token, ++tryCount)
        resolve(result)
      }, timeInterval)
    })
  }

}
