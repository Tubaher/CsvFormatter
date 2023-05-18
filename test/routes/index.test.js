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
          done()
        })
    })
  })
})
