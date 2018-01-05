const chai = require("chai")
chai.should()
const sinon = require("sinon")
const nock = require("nock")
const testServerRender = require('../../libs/test-server-rendering')

describe("test-server-rendering", function () {
  this.timeout(10000)
  let server = nock("http://testme.com")
  beforeEach(() => {
    server.get("/t")
      .reply(200, "test mock server")

    server.get("/not-ready")
      .reply(404, "not-ready")

    server.get("/never-ready")
      .reply(404, "not-ready")
  })

  it("should be able to test with mock server", (done) => {
    testServerRender("http://testme.com/t", function(err, response, result) {
      response.statusCode.should.equal(200)
      done()
    })

  })
  
  it("should be called again even if the response is delayed", (done) => {
    setTimeout(() => {
      server.get("/not-ready")
        .reply(200, "response")
    }, 1000)
    testServerRender("http://testme.com/not-ready", function(err, response, result) {
      response.statusCode.should.equal(200)
      done()
    })
  })
  it("should return the response if the delayed is too long", (done) => {
    testServerRender("http://testme.com/never-ready", function(err, response, result) {
      if (err) {
        err.should.exist
      } else {
        response.statusCode.should.equal(404)
      }
      done()
    })
  })
})