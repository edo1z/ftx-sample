const { noOrder, getOrderCategory, orders, getPastOrders } = require('../../data/order')
const { order } = require('../../ftx/apiClient')
const moment = require('moment')

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

test('data.order.getPastOrders', () => {
  const created = [
    moment().add(-15, 'seconds').format(),
    moment().format(),
    moment().add(-5, 'seconds').format()
  ]
  console.log(created[0], created[1], created[2])
  orders.test = [
    {id:1, status: 'new', orderCategory: 'order', createdAt: created[0]},
    {id:2, status: 'new', orderCategory: 'order', createdAt: created[1]},
    {id:3, status: 'new', orderCategory: 'order', createdAt: created[2]}
  ]
  expect(getPastOrders('test', 10000, 'order')).toStrictEqual([
    {id:1, status: 'new', orderCategory: 'order', createdAt: created[0]}
  ])
})
