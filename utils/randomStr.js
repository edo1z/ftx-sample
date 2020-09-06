exports.randomStr = (strNum = 10) => {
  const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from(Array(strNum)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
}
