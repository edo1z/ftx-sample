const ftx = require('./ftx/apiClient')
const { connect } = require('./ftx/webSocketClient')

const main = async () => {
  const subscriptions = [
    { channel: 'ticker', market: 'ETH-PERP' },
    { channel: 'ticker', market: 'LINK-PERP' },
    { channel: 'ticker', market: 'DOT-PERP' },
    { channel: 'fills', market: null },
    { channel: 'orders', market: null },
  ]
  connect({ subscriptions: subscriptions })
}

main()
