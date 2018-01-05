const test = require("./libs/test-server-rendering")
const parserCreator = require("./libs/parser-creator")
const config = require("nfs-config-resolver")()

const parser = parserCreator(function(result, dom) {
  if (result) {
    // test server render pass
    console.log("test pass!")
    process.exit(0)
  } else {
    console.error("Error finding content in", dom)
    process.exit(1)
  }
})

test(config.testURL, function(err, response, body) {
  if (response && response.statusCode === 200) {
    parser.write(body)
    parser.end()
  }
})
