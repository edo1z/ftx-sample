const { init: initPosi, positions, calcProfit, posi } = require('../../data/position')
const { ticks } = require('../../data/tick')

test('data.position.init', () => {
  initPosi(['hoge', 'page'])
  expect(positions).toStrictEqual({
    hoge: { side: null, size: 0, price: 0, profit: 0 },
    page: { side: null, size: 0, price: 0, profit: 0 },
  })
})

test('data.position.calcProfit', () => {
  const market = 'test'
  positions[market] = { side: 'buy', size: 0.1, price: 100, profit: 0 }
  ticks[market] = [{last: 50}]
  expect(calcProfit(market)).toStrictEqual({
    priceRange: -50,
    profit: -5
  })
  expect(posi(market).profit).toBe(-5)
})
