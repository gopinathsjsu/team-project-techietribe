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
      first_name: 'pranjali',
      last_name: 'bidwai',
      date_of_birth: 'test@test.com',
      gender: 'female',
      account_type: 'current',
      user_pass: 'password123',
    };
    chai
      .request(server)
      .post('/addAccount')
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
