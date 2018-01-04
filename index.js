const curl = require("curlrequest")
const htmlparser = require("htmlparser2")
const _ = require("lodash")

const domUtils = htmlparser.DomUtils

const parserHandler = new htmlparser.DomHandler(function(err, dom) {
	if (err) {
		console.error(err)
	}
	const result = domUtils.getElements({id: "content"}, dom, true)
	// only get one element with parent body
	const contentElement = _.first(_.filter(result, (m) => m.parent && m.parent.name === "body"))
	console.log(contentElement)
})

const parser = new htmlparser.Parser(parserHandler)

curl.request({
	url: "http://localhost:3001"
}, function(err, result) {
	if (err) {
		console.error(err)
	}
	// console.log(result)
	parser.write(result)
	parser.end()
})