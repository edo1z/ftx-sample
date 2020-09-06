const _shouldStopLoss = (market) => {
  const nowPrice = tickData.latest(market).last
  const profit = positionData.profit(market, nowPrice)
  if (profit && profit.priceRange < 0) {
    if (Math.abs(profit.priceRange) / nowPrice > maxLossRate) {
      return true
    }
  }
  return false
}
