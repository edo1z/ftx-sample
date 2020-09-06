module.exports = {
  amountPerTransaction: 1,
  minTradeAmountDiff: 100000,
  maxSpreadRate: 0.0005,
  minProfitRate: 0.0005,
  maxLossRate: 0.00025,
  orderTimeLimit: 10,
  counterOrderTimeLimit: 10,
  markets: ['ETH-PERP'],
}

const _default = {
  amountPerTransaction: 1,
  minTradeAmountDiff: 1000000,
  maxSpreadRate: 0.0005,
  minProfitRate: 0.0005,
  maxLossRate: 0.00025,
  orderTimeLimit: 20,
  counterOrderTimeLimit: 60,
  markets: ['ETH-PERP'],
}
