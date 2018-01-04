const chai = require("chai")
chai.should()
const sinon = require("sinon")
const fs = require("fs")
const path = require("path")

const parserCreator = require("../../libs/parser-creator")

describe("parser module", function() {
  it("should be able to call a callback after passing the html", () => {
    const spy = sinon.spy()
    const parser = parserCreator(spy)
    parser.write("<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>")
    parser.end()
    spy.calledOnce.should.be.true
  })
	it("should be able to return true when html pass server render", () => {
	  const spy = sinon.spy()
    const parser = parserCreator(spy)
    const html = fs.readFileSync(path.join(__dirname, "../fixtures/pass.html"), "utf8")
    parser.write(html)
    parser.end()
    spy.calledWith(true).should.be.true
	})
  it("should be able to return false when html fail server render", () => {
    const spy = sinon.spy()
    const parser = parserCreator(spy)
    const html = fs.readFileSync(path.join(__dirname, "../fixtures/fail.html"), "utf8")
    parser.write(html)
    parser.end()
    spy.calledWith(false).should.be.true
  })
})