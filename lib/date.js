
module.exports.now = function now() {
  return (new Date()).toISOString()
}

module.exports.oneMinAgo = function oneMinAgo() {
  return (new Date(Date.now() - 60 * 1000)).toISOString()
}

module.exports.oneHourAgo = function oneHourAgo() {
  return (new Date(Date.now() - 60 * 60 * 1000)).toISOString()
}

module.exports.oneDayAgo = function oneDayAgo() {
  return (new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString()
}

module.exports.oneWeekAgo = function oneWeekAgo() {
  return (new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString()
}

module.exports.oneMonthAgo = function oneMonthAgo() {
  return (new Date(Date.now() - 30 * 7 * 24 * 60 * 60 * 1000)).toISOString()
}
