const request = require('./apiRequest')

exports.getAllSubAccounts = async () => {
  return await request('GET', '/subaccounts', null, true)
}
