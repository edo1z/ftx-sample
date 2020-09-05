const statuses = {}

const init = (markets) => {
  markets.forEach((market) => (statuses[market] = {
    onTick: {wait: false},
    onOrder: {wait: false},
    onFill: {wait: false},
    order: { wait: false },
    counterOrder: {wait: false},
    cancel: {wait: false},
    stopLoss: {wait: false}
  }))
}

exports.statuses = statuses
exports.init = init
