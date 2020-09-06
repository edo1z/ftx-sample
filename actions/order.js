const ftx = require('../ftx/apiClient')
const {err} = require('../error/error')
const {setOrder} = require('../data/order')
const {sleep} = require('../utils/sleep')

exports.order = async (orderInfo) => {
  console.log('[order] Start')
  try {
    const result = await ftx.order(orderInfo)
    setOrder(result.data.result, 'order')
    console.log('[order] Fin')
  } catch(e) {
    err(e)
    console.log('[order] Fail! SLEEP 1000 msec...')
    await sleep(1000)
  }
}
