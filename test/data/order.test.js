const { noOrder, getOrderCategory, orders, getPastOrders, specifiedSize, getAllByOrderCategory } = require('../../data/order')
const {ticks} = require('../../data/tick')
const conf = require('../../config/index')
const {markets} = require('../../data/market')
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
  orders.test = [
    {id:1, status: 'new', orderCategory: 'order', createdAt: created[0]},
    {id:2, status: 'new', orderCategory: 'order', createdAt: created[1]},
    {id:3, status: 'new', orderCategory: 'order', createdAt: created[2]}
  ]
  expect(getPastOrders('test', 10000, 'order')).toStrictEqual([
    {id:1, status: 'new', orderCategory: 'order', createdAt: created[0]}
  ])
})

test('data.order.specifiedSize', () => {
  const market = 'test'
  ticks[market] = [{bid: 350, ask: 360}]
  let side = 'buy'
  conf.amountPerTransaction = 1
  markets[market] = {
    priceIncrement: 0.01,
    sizeIncrement: 0.001
  }
  expect(specifiedSize(market, side)).toBe(0.002857)
  side = 'sell'
  expect(specifiedSize(market, side)).toBe(0.002778)
})

test('data.order.getAllByOrderCategory', () =>  {
  const market = 'test'
  orders.test = [
    { id: 1, orderCategory: 'order', status: 'new' },
    { id: 2, orderCategory: 'counterOrder', status: 'new' },
    { id: 3, status: 'new' },
    { id: 4, orderCategory: 'counterOrder', status: 'closed' },
  ]
  const result = getAllByOrderCategory(market, 'counterOrder')
  expect(result).toStrictEqual([
    { id: 2, orderCategory: 'counterOrder', status: 'new' },
  ])
  const result2 = getAllByOrderCategory(market, 'order')
  expect(result2).toStrictEqual([
    { id: 1, orderCategory: 'order', status: 'new' },
  ])
})
