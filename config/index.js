module.exports = {
  amountPerTransaction: 1,
  minTradeAmountDiff: 750000,
  maxSpreadRate: 0.0015,
  minProfitRate: 0.0001,
  maxLossRate: 0.001,
  maxLossRateOfModifyOrder: 0.0005,
  orderTimeLimit: 10,
  counterOrderTimeLimit: 30,
  markets: ['ETH-PERP'],
}

const _default = {
  amountPerTransaction: 1,
  minTradeAmountDiff: 750000,
  maxSpreadRate: 0.0015,
  minProfitRate: 0.0002,
  maxLossRate: 0.001,
  maxLossRateOfModifyOrder: 0.0005,
  orderTimeLimit: 10,
  counterOrderTimeLimit: 60,
  markets: ['ETH-PERP'],
}
