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
  console.log(`[counterOrder] try(${tryCount}) side:`, orderInfo.side, ' price:', orderInfo.price, ' size:', orderInfo.size,  token)
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
