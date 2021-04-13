let express = require('express');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

// Assertion Style

chai.should();
chai.use(chaiHttp);

//test your REST API here

describe('CreateCustomerAccount', () => {
  it('It should return 200 if Customer Added to Account', (done) => {
    var body = {
      first_name: 'pranjali',
      last_name: 'bidwai',
      date_of_birth: '1994-10-01',
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
