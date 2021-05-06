let httpMocks = require('node-mocks-http');
let chai = require('chai')
let getInfoHandler = require("../routes/getInfo");
let expect = chai.expect

describe("get customer info", function() {
    it('should return 200 if information is sent successfully', done => {
        var request = httpMocks.createRequest({
            body: {
                customer_id: 12345,
                first_name: "firstInfo1",
                last_name : "lastInfo1",
                is_admin: false
            },
        });
        var response = httpMocks.createResponse();

        getInfoHandler.customerInfo(request, response, function () {
            expect(response.statusCode).to.equal(200);
            expect(response._getJSONData().customer_id).to.equal(12345);
            expect(response._getJSONData().firstName).to.equal('firstInfo1');
            expect(response._getJSONData().lastName).to.equal('lastInfo1');
            expect(response._getJSONData().isAdmin).to.equal(false);
            done();
        });

    })

});
