const ftx = require('../../ftx/apiClient')
const {err} = require('../../error/error')
const {setMarkets, markets, priceIncrement, sizeIncrement} = require('../../data/market')

test('data.market.setMarkets', async () => {
  const result = await ftx.getMarkets().catch(err)
  setMarkets(result.data.result)
  const marketName = 'ETH-PERP'
  expect(priceIncrement(marketName)).toBe(0.01)
  expect(sizeIncrement(marketName)).toBe(0.001)
})
