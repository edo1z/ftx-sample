exports.canCancelOrder = (market) => {

}

const shouldCancelOrders = (
  market,
  orderTimeLimit,
  counterOrderTimeLimit,
  shouldStopLoss,
) => {
  let orderIds = { order: [], counterOrder: [] }
  if (_orderNumber(market) <= 0) return orderIds
  for (let key of Object.keys(orders[market])) {
    const order = orders[market][key]
    if (order.data.status === 'closed') continue
    if (order.waiting) continue
    const timeLimit =
      order.type === 'order' ? orderTimeLimit : counterOrderTimeLimit
    if (
      (shouldStopLoss && order.type === 'counterOrder') ||
      moment().diff(moment(order.createdAt, 'x')) > timeLimit * 1000
    ) {
      orderIds[order.type].push(key)
      order.waiting = true
    }
  }
  return orderIds
}
