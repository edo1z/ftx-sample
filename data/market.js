const markets = {}

exports.setMarkets = (marketsData) => {
  marketsData.forEach((market) => (markets[market.name] = market))
}
exports.priceIncrement = (market) => markets[market].priceIncrement
exports.sizeIncrement = (market) => markets[market].sizeIncrement

exports.markets = markets
