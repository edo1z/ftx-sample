const ftx = require('./ftxApi')

const main = async () => {
  try {
    const res = await ftx.getAllSubAccounts()
    console.log(res.data.result)
  } catch (err) {
    const status = err.response.status
    const statusText = err.response.statusText
    const message = err.response.data.error
    console.log(status, statusText, message)
  }
}

main()
