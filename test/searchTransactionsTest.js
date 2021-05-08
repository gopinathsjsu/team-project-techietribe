let httpMocks = require("node-mocks-http");
let chai = require("chai");
let searchTransactionsHandler = require("../routes/searchTransactions");
let expect = chai.expect;
let sinon = require("sinon");
var mySQL = require("mysql");

describe("Search Transactions", function () {
  
  it("should return 200 if Transactions search is successful", (done) => {
    var request = httpMocks.createRequest({
      query: {
        account_id: "12345",
        keyword: "test"
      },
    });
    var response = httpMocks.createResponse();

    var rows = [
      {
        id: 123,
        source_account_id: 12345,
        destination_account_id: 345,
        description: "test description",
        amount: 10.1,
        date: "2021-01-03",
        payee_name: "test1"
      },
    ];

    const connStub = {
      query: sinon
        .stub()
        .withArgs(
          "SELECT id,source_account_id,destination_account_id,description,amount,date,payee_name FROM `Bank`.Transaction WHERE (source_account_id = ? OR destination_account_id = ? ) AND description LIKE ? ORDER BY date",
          ["12345", "12345","%test%"],
        )
        .yields(null, rows),
      release: sinon.stub(),
    };
    const poolStub = { getConnection: sinon.stub().yields(null, connStub) };
    sinon.stub(mySQL, "createPool").returns(poolStub);

    searchTransactionsHandler.searchTransactionsHelper(mySQL, request, response, function () {
        expect(response.statusCode).to.equal(200);
        expect(response._getJSONData()).to.eql(rows);
        done();
      }
    );

    mySQL.createPool.restore();
  });

  it("should return 500 if Transaction search fails", (done) => {
    var request = httpMocks.createRequest({
      body: {
        account_id: "12345",
        keyword: "test"
      },
    });
    var response = httpMocks.createResponse();

    const connStub = {
      query: sinon
        .stub()
        .withArgs(
          "SELECT id,source_account_id,destination_account_id,description,amount,date,payee_name FROM `Bank`.Transaction WHERE (source_account_id = ? OR destination_account_id = ? ) AND description LIKE ? ORDER BY date",
          ["12345", "12345","%test%"],
        )
        .yields({error: "Unable to search data!"}, null),
      release: sinon.stub(),
    };
    const poolStub = { getConnection: sinon.stub().yields(null, connStub) };
    sinon.stub(mySQL, "createPool").returns(poolStub);

    searchTransactionsHandler.searchTransactionsHelper(mySQL, request, response, function () {
        expect(response.statusCode).to.equal(500);
        expect(response._getJSONData().error).to.equal('failed to search transactions');
        done();
      }
    );

    mySQL.createPool.restore();
  });

});
