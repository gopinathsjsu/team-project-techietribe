let express = require('express');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

// Assertion Style

chai.should();
chai.use(chaiHttp);

//test your REST API here

describe('Add Account', () => {
  it('It should return 200 if Customer Added to Account', (done) => {
    var body = {
      first_name: 'pranjali',
      last_name: 'bidwai',
      date_of_birth: '1994-10-01',
      gender: 'female',
      account_type: 'current',
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
  //second test case in chai-mocha

  it('It should return 404 if not found', (done) => {
    var body = {
      first_name: 'pranjali',
      last_name: 'bidwai',
      date_of_birth: '1994-10-01',
      gender: 'female',
      account_type: 'current',
    };

    chai
      .request(server)
      .post('/addAccounts')
      .send()

      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
