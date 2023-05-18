const chaiHttp = require('chai-http')
const chai = require('chai')
const server = require('../../bin/www')
const mocha = require('mocha')

chai.should()
chai.use(chaiHttp)

mocha.describe('CSV Formatter API', () => {
  mocha.describe('GET /files/data', () => {
    mocha.it('should return an array of files', (done) => {
      chai.request(server)
        .get('/files/data')
        .end((_, res) => {
          res.should.have.status(200)
          // eslint-disable-next-line no-unused-expressions
          res.should.to.be.json
          res.body.should.be.a('array')
          res.body.length.should.be.eql(3)
          res.body[0].should.have.all.keys('file', 'lines')
          done()
        })
    })
  })
  mocha.describe('GET /files/data/other', () => {
    mocha.it('should return a 404 error', (done) => {
      chai.request(server)
        .get('/files/data/other')
        .end((_, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
})
