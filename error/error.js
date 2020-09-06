exports.err = (err) => _err(err, false)
exports.errExit = (err) => _err(err, true)
const _err = (err, exit) => {
  try {
    _errForFTX(err)
  } catch(e) {
    console.log(`[ERROR] ${err.message}`)
  }
  if (exit) process.exit(1)
}

const _errForFTX = err => {
  const res = err.response
  console.log(`[FTX ERROR][${res.status} - ${res.statusText}] ${res.data.error} - ${res.config.url}`)
}
