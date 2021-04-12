let express = require('express');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

// Assertion Style

chai.should();
chai.use(chaiHttp);

//test your REST API here
describe('CreateCustomerAccount', function () {
  it('It should return 200 if Customer Added to Account', (done) => {
    var body = {
      first_name: 'Abdulrahman',
      last_name: 'Alfayad',
      date_of_birth: 'test@test.com',
      gender: '123',
      account_type: 'current',
      user_pass: 'password123',
    };
    chai
      .request(server)
      .post('/addAccount')
      .send(body)
      .end((err, response) => {
        response.should.have.status(200);
        done();
      });
  });
});
