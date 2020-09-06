const { noOrder, getOrderCategory, orders } = require('../../data/order')

test('data.order.noOrder', () => {
  orders.test = [
    { id: 1, status: 'new' },
    { id: 2, status: 'new' },
  ]
  expect(noOrder('test')).toBe(false)

  orders.test = [
    { id: 1, status: 'closed' },
    { id: 2, status: 'closed' },
  ]
  expect(noOrder('test')).toBe(true)

  orders.test = [
    { id: 1, status: 'closed' },
    { id: 2, status: 'new' },
  ]
  expect(noOrder('test')).toBe(false)
})

test('data.order.getOrderCategory', () => {
  orders.test = [
    { id: 1, orderCategory: 'order', status: 'new' },
    { id: 2, orderCategory: 'counterOrder', status: 'new' },
    { id: 3, status: 'new' },
  ]
  expect(getOrderCategory('test', 1)).toBe('order')
  expect(getOrderCategory('test', 2)).toBe('counterOrder')
  expect(getOrderCategory('test', 3)).toBe(undefined)
})
