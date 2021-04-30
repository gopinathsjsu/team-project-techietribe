let httpMocks = require('node-mocks-http');
let chai = require('chai');
let viewAccountHandler = require('../routes/viewAccount');
let expect = chai.expect;
let sinon = require('sinon');
var mySQL = require('mysql');

describe('View Account', function () {
  it('should return 200 if Account retrieval is successful', (done) => {
    var request = httpMocks.createRequest({
      body: {
        id: 10,
      },
    });
    var response = httpMocks.createResponse();

    var rows = [
      {
        id: 10,
        customer_id: 2345,
        card_id: 2870,
        balance: 1001.1,
        account_type: 'Checkings',
      },
    ];

    const connStub = {
      query: sinon
        .stub()
        .withArgs('SELECT * FROM `Bank`.Account WHERE id = ? ', [10])
        .yields(null, rows),
      release: sinon.stub(),
    };
    const poolStub = { getConnection: sinon.stub().yields(null, connStub) };
    sinon.stub(mySQL, 'createPool').returns(poolStub);

    viewAccountHandler.viewAccountHelper(mySQL, request, response, function () {
      expect(response.statusCode).to.equal(200);
      expect(response._getJSONData()).to.eql(rows);
      done();
    });

    mySQL.createPool.restore();
  });

  it('should return 500 if Account retrieval fails', (done) => {
    var request = httpMocks.createRequest({
      body: {
        id: '10',
      },
    });
    var response = httpMocks.createResponse();
    const connStub = {
      query: sinon
        .stub()
        .withArgs('SELECT * FROM `Bank`.Account WHERE id = ? ', [10])
        .yields({ error: 'Unable to retrieve Account data!' }, null),
      release: sinon.stub(),
    };
    const poolStub = { getConnection: sinon.stub().yields(null, connStub) };
    sinon.stub(mySQL, 'createPool').returns(poolStub);

    viewAccountHandler.viewAccountHelper(mySQL, request, response, function () {
      expect(response.statusCode).to.equal(500);
      expect(response._getJSONData().error).to.equal('failed to view Account');
      done();
    });

    mySQL.createPool.restore();
  });
});
