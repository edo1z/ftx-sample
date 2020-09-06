const { randomStr } = require('../../utils/randomStr')

test('utills/randomStr', () => {
  expect(randomStr(10).length).toBe(10)
  expect(randomStr(15).length).toBe(15)
})
