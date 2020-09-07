const markets = {}

exports.setMarkets = (data) => markets[data.name] = data
exports.priceIncrement = (market) => markets[market].priceIncrement
exports.sizeIncrement = (market) => markets[market].sizeIncrement
