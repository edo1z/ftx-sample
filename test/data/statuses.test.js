const { TestScheduler } = require("jest");
const {statuses, init, isWaiting, setWait} = require('../../data/statuses')

test('data.statuses.isWait', () => {
  const markets = ['hoge', 'page']
  init(markets)
  setWait('hoge', 'modifyOrder', true)
  expect(isWaiting('hoge', 'modifyOrder')).toBe(true)
  expect(isWaiting('page', 'modifyOrder')).toBe(false)
})
