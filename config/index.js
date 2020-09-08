module.exports = {
  amountPerTransaction: 1,
  minTradeAmountDiff: 75000,
  maxSpreadRate: 0.0018,
  minProfitRate: 0.0002,
  maxLossRate: 0.001,
  maxLossRateOfModifyOrder: 0.000025,
  orderTimeLimit: 10,
  counterOrderTimeLimit: 120,
  markets: ['ETH-PERP'],
}

const _default = {
  amountPerTransaction: 1,
  minTradeAmountDiff: 1000000,
  maxSpreadRate: 0.0005,
  minProfitRate: 0.0005,
  maxLossRate: 0.0006,
  maxLossRateOfModifyOrder: 0.0004,
  orderTimeLimit: 20,
  counterOrderTimeLimit: 60,
  markets: ['ETH-PERP'],
}
