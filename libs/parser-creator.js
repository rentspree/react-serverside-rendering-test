const htmlparser = require("htmlparser2")
const _ = require("lodash")
const config = require("nfs-config-resolver")()

const domUtils = htmlparser.DomUtils

const parserCreator = function(callback) {
	const parserHandler = new htmlparser.DomHandler(function(err, dom) {
		if (err) {
			console.error(err)
		}
		const result = domUtils.getElements({id: config.reactRootId}, dom, true)
		// only get one element with parent body
		const contentElement = _.first(_.filter(result, (m) => m.parent && m.parent.name === "body"))
		if (contentElement && contentElement.children && contentElement.children.length > 0 ) {
			callback(true)
		} else {
		  if (contentElement) {
		    callback(false, domUtils.getOuterHTML(contentElement))
      }
			callback(false)
		}
	})
	return new htmlparser.Parser(parserHandler)
}

module.exports = parserCreator