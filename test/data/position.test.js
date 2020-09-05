const { init: initPosi, noPosi, positions } = require('../../data/position')

test('initPosi', () => {
  initPosi(['hoge', 'page'])
  expect(positions).toStrictEqual({
    hoge: { side: null, size: 0, price: 0, profit: 0 },
    page: { side: null, size: 0, price: 0, profit: 0 }
  })
})
