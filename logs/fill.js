exports.fill = data => {
  console.log(`[${data.market}][Fill] ${data.side} ${data.price} ${data.size} - FEE: ${data.fee}`)
}
