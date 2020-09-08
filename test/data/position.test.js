const { init: initPosi, positions, calcProfit, posi } = require('../../data/position')
const { ticks } = require('../../data/tick')
const conf = require('../../config/index')

test('data.position.init', () => {
  initPosi(['hoge', 'page'])
  expect(positions).toStrictEqual({
    hoge: { side: null, size: 0, entryPrice: 0, profit: 0 },
    page: { side: null, size: 0, entryPrice: 0, profit: 0 },
  })
})

test('data.position.calcProfit', () => {
  const market = 'test'
  positions[market] = { side: 'buy', size: 0.002, entryPrice: 330, profit: 0 }
  ticks[market] = [{last: 350, bid: 340, ask: 360}]
  conf.amountPerTransaction = 1
  expect(calcProfit(market, 'buy')).toStrictEqual({
    priceRange: 10,
    profit: 0.02,
    profitRate: 0.02
  })
  expect(posi(market).profit).toBe(0.02)
})
