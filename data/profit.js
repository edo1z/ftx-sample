const profit = (market, nowPrice) => {
  const position = positions[market]
  if (position.size <= 0) return null
  let profit
  if(position.side === 'buy') {
    priceRange = nowPrice - position.price
  } else {
    priceRange = position.price - nowPrice
  }
  profit = priceRange * position.size
  position.profit = profit
  return {priceRange: priceRange, profit: profit}
}
