let httpMocks = require("node-mocks-http");
let chai = require("chai");
let closeAccountHandler = require("../routes/closeAccount");
let expect = chai.expect;
let sinon = require("sinon");
var mySQL = require("mysql");

describe("Close Account", function () {
    it("should return 200 if close Account succeeds", (done) => {
        var request = httpMocks.createRequest({
            body: {
                customer_id: "12345",
                card_id: "12345",
            },
        });
        var response = httpMocks.createResponse();
        var id = 12345;
        var card_id = 12345;
        const connStub = {
            query: sinon
                .stub()
                .withArgs('DELETE FROM `Bank`.Account WHERE id =? AND Card_id=?', ["12345", "12345"])
                .yields(null, {message: "success"}),

            query: sinon
                .stub()
                .withArgs("DELETE FROM `Bank`.Customer WHERE id ='" + id + "'")
                .yields(null, {message: "success"}),

            query: sinon
                .stub()
                .withArgs("DELETE FROM `Bank`.Card WHERE id = '" + card_id + "'")
                .yields(null, {message: "success"}),
            release: sinon.stub(),
        };
        const poolStub = {getConnection: sinon.stub().yields(null, connStub)};
        sinon.stub(mySQL, "createPool").returns(poolStub);

        closeAccountHandler.closeAccountHelper(mySQL, request, response, function () {
                expect(response.statusCode).to.equal(200);
                console.log(response._getJSONData());
                expect(response._getJSONData()).to.eql({message: "success"});
                done();
            }
        );
        mySQL.createPool.restore();
    });

    it("should return 500 if close Account fails", (done) => {
        var request = httpMocks.createRequest({
            body: {
                customer_id: "12345",
                card_id: "12345"
            },
        });
        var response = httpMocks.createResponse();
        var id = 54321;
        var card_id = 54321;

        const connStub = {
            query: sinon
                .stub()
                .withArgs('DELETE FROM `Bank`.Account WHERE id =? AND Card_id=?', ["54321", "54321"])
                .yields({message: "failed to close account"}, null),

            query: sinon
                .stub()
                .withArgs("DELETE FROM `Bank`.Customer WHERE id ='" + id + "'")
                .yields({message: "failed to close account"}, null),

            query: sinon
                .stub()
                .withArgs("DELETE FROM `Bank`.Card WHERE id = '" + card_id + "'")
                .yields({message: "failed to close account"}, null),

            release: sinon.stub(),
        };
        const poolStub = {getConnection: sinon.stub().yields(null, connStub)};
        sinon.stub(mySQL, "createPool").returns(poolStub);

        closeAccountHandler.closeAccountHelper(mySQL, request, response, function () {
                expect(response.statusCode).to.equal(500);
                done();
            }
        );
        mySQL.createPool.restore();
    });

});
