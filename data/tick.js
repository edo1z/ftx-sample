const maxTickLength = 20
const ticks = {}

const init = (markets) => {
  markets.forEach((market) => (ticks[market] = []))
}

const setTick = (market, data) => {
  ticks[market].push(data)
  if (ticks[market].length > maxTickLength) ticks[market].shift()
}

const totalSize = (market) => {
  let bidSize = 0
  let askSize = 0
  ticks[market].forEach((tick) => {
    bidSize += tick.bidSize
    askSize += tick.askSize
  })
  return { bidSize: bidSize, askSize: askSize }
}

exports.latest = (market) => ticks[market][ticks[market].length - 1]

exports.ticks = ticks
exports.init = init
exports.setTick = setTick
exports.totalSize = totalSize
