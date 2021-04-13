let express = require('express');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

// Assertion Style

chai.should();
chai.use(chaiHttp);
// rest api code for transaction
describe('Adding-Transaction', () => {
  it('It should return 200 if Transaction is successful', (done) => {
    var body = {
      account_id: 12709529,
      description: 'manual transaction',
      amount: 700.0,
      date: '2016-08-01',
    };
    chai
      .request(server)
      .post('/addTransaction')
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
