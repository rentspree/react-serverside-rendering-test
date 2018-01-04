const test = require("./libs/test-server-rendering")
const parserCreator = require("./libs/parser-creator")
const config = require("nfs-config-resolver")()

const parser = parserCreator(function(result) {
  console.log(result)
})

test(config.testURL, function(err, response, body) {
  if (response && response.statusCode === 200) {
    parser.write(body)
    parser.end()
  }
})
