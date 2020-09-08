const statuses = {}

const init = (markets) => {
  markets.forEach((market) => (statuses[market] = {
    order: { wait: false },
    modifyOrder: {wait: false},
    cancel: {wait: false},
    stopLoss: {wait: false}
  }))
}

exports.isWaiting = (market, name) => statuses[market][name].wait
exports.setWait = (market, name, value) => {
  statuses[market][name].wait = value
}

exports.statuses = statuses
exports.init = init
