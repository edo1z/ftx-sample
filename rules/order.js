
const _canOrder = (market, data) => {
  const spreadRate = (data.ask - data.bid) / data.last
  const totalSize = tickData.totalSize(market)
  const tradeAmountDiff = (totalSize.bidSize - totalSize.askSize) * data.last
  if (tradeAmountDiff * -1 > minTradeAmountDiff && spreadRate < maxSpreadRate) {
    if (!orderData.isOpeningOrder(market)) {
      return _orderInfo(market, data, 'ask')
    }
  } else if (
    tradeAmountDiff > minTradeAmountDiff &&
    spreadRate < maxSpreadRate
  ) {
    if (!orderData.isOpeningOrder(market)) {
      return _orderInfo(market, data, 'bid')
    }
  }
  return null
}
