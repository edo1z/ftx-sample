
const _cancelOrders = async (orderIds) => {
  orderIds.forEach(async (orderId) => {
    console.log('cancel order', orderId)
    await ftx.cancelOrder(orderId).catch(ftx.errorExit)
    console.log('cancel order FIN', orderId)
  })
}
