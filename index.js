const curl = require("curlrequest")

curl.request({
	url: "http://localhost:3001"
}, function(err, result) {
	if (err) {
		console.error(err)
	}
	// console.log(result)
	// parser.write(result)
	// parser.end()
})