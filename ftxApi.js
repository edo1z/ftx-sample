const request = require('./ftxApiRequest')

exports.getAllSubAccounts = async () => {
  return await request('GET', '/subaccounts', null, true)
}
