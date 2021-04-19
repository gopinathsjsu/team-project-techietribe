let httpMocks = require('node-mocks-http');
let chai = require('chai');
let addTransactionsHandler = require('../routes/addTransactions');
let expect = chai.expect;
let sinon = require('sinon');
var mySQL = require('mysql');

describe('Add Transactions', function () {
  before(function () {
    this.timeout(10000); // 10 second timeout for setup
  });
  it('should return 200 if Transaction  is successful', (done) => {
    var request = httpMocks.createRequest({
      body: {
        account_id: '12345',
        description: 'test description',
        amount: '10.1',
        date: '2021-01-03',
      },
    });
    var response = httpMocks.createResponse();

    var account_id = 12345;
    var description = 'test description';
    var amount = 10.1;
    var date = '2021 - 01 - 03';

    const connStub = {
      query: sinon
        .stub()
        .withArgs(
          'INSERT INTO `Bank`.Transaction (account_id,description,amount,date)values (?,?,?,?,?)',
          ['12345', 'test description', '10.1', '2021 - 01 - 03']
        )
        .yields(null, { message: 'success' }),
      release: sinon.stub(),
    };
    const poolStub = { getConnection: sinon.stub().yields(null, connStub) };
    sinon.stub(mySQL, 'createPool').returns(poolStub);

    addTransactionsHandler.addTransactionsHelper(
      mySQL,
      request,
      response,
      function () {
        expect(response.statusCode).to.equal(200);

        console.log(response._getJSONData());
        expect(response._getJSONData()).to.eql({ message: 'success' });
        done();
      }
    );

    mySQL.createPool.restore();
  }).timeout(10000);

  it('should return 500 if create(add)Transaction fails', (done) => {
    var request = httpMocks.createRequest({
      body: {
        account_id: '12345',
        description: 'test description',
        amount: '10.1',
        date: '2021-01-03',
      },
    });
    var response = httpMocks.createResponse();
    var account_id = 1245;
    var description = 'description';
    var amount = 10;
    var date = '2021 - 01 - 08';
    const connStub = {
      query: sinon
        .stub()
        .withArgs(
          'INSERT INTO `Bank`.Transaction (id,account_id,description,amount,date)values (?,?,?,?,?)',
          ['1235', ' description', '10', '2021 - 01 - 08']
        )
        .yields({ message: 'failed to add Transaction' }, null),
      release: sinon.stub(),
    };
    const poolStub = { getConnection: sinon.stub().yields(null, connStub) };
    sinon.stub(mySQL, 'createPool').returns(poolStub);

    addTransactionsHandler.addTransactionsHelper(
      mySQL,
      request,
      response,
      function () {
        expect(response.statusCode).to.equal(500);

        done();
      }
    );

    mySQL.createPool.restore();
  });
});
