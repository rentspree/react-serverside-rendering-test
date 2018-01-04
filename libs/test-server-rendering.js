const request = require("request")
const maxTryCount = 15

const test = function(url, callback, tryCount = 0) {
  request(url, function(err, response, body) {
    if (err) {
      tryAgain(url, callback, [err, response, body], tryCount)
      return
    }
    if (response && response.statusCode !== 200) {
      tryAgain(url, callback, [err, response, body], tryCount)
    } else {
      callback(null, response, body)
    }
  })
}


const tryAgain = function(url, callback, responseObject, tryCount) {
  if (tryCount >= maxTryCount) {
    callback(...responseObject)
    return
  }
  setTimeout(() => {
    test(url, callback, tryCount + 1)
  }, 500)
}

module.exports = test