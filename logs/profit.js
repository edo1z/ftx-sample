const _displayProfit = (data) => {
  const position = positions[data.market]
  let profit
  if (position.side === 'buy') {
    profit = (data.price - position.price) * data.size
  } else {
    profit = (position.price - data.price) * data.size
  }
  console.log(
    `[${data.market}][PROFIT] SIDE: ${position.side} IN: ${position.price} OUT: ${data.price} SIZE: ${data.size} PROFIT: ${profit}`,
  )
}
