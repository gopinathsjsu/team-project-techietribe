let express = require('express');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

// Assertion Style

chai.should();
chai.use(chaiHttp);

//test your REST API here

describe('Add Transaction', () => {
  it('It should return 200 if Customer Added to Account', (done) => {
    var body = {
      destination_account_id: 5689,
      amount: 11,
      description: 'transaction',
      date: '2024-01-24',
    };
    chai
      .request(server)
      .post('/addTransactions')
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  //second test case in chai-mocha

  it('It should return 404 if not found', (done) => {
    var body = {
      destination_account_id: '5689',
      amount: '11',
      description: 'transaction',
      date: '2024-01-24',
    };

    chai
      .request(server)
      .post('/addTransaction')
      .send()

      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  // third test case to add transaction
});
