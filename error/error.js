exports.err = (err) => _err(err, false)
exports.errExit = (err) => _err(err, true)
const _err = (err, exit) => {
  let message = null
  try {
    message = _errForFTX(err)
  } catch(e) {
    message = err.message
    console.log(`[ERROR] ${message}`)
  }
  if (exit) process.exit(1)
  return message
}

const _errForFTX = err => {
  const res = err.response
  console.log(`[FTX ERROR][${res.status} - ${res.statusText}] ${res.data.error} - ${res.config.url}`)
  return res.data.error
}
