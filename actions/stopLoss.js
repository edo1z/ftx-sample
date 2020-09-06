const ftx = require('../ftx/apiClient')
const { err } = require('../error/error')
const { randomStr } = require('../utils/randomStr')

exports.stopLoss = async (market, orderInfo) => {
  const token = randomStr(15)
  await _cancelAllOrders(market, token)
  await _stopLossOrder(market, orderInfo, token)
}

const maxTryCount = 10
const timeInterval = 3000

const _cancelAllOrders = async (market, token, tryCount = 1) => {
  if (tryCount > maxTryCount) {
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
    console.log(`[CancelAll] Fail! SLEEP ${timeInterval} msec... token: ${token}`)
    return new Promise(resolve => {
      setTimeout(async () => {
        const result = await _cancelAllOrder(market, token, ++tryCount)
        resolve(result)
      }, timeInterval)
    })
  }
}

const _stopLossOrder = async (market, orderInfo, token, tryCount = 1) => {
  if (tryCount > maxTryCount) {
    console.log(
      `[StopLoss] Exceeded maximum number of attempts for Order. token: ${token}`,
    )
    process.exit(1)
  }
  console.log(`[StopLoss] try(${tryCount}). token: ${token}`)
  try {
    await ftx.order(orderInfo)
    console.log(`[StopLoss] Success! token: ${token}`)
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
