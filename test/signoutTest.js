let httpMocks = require('node-mocks-http');
let chai = require('chai')
const AWS = require('aws-sdk-mock');
let signOutHandler = require('../routes/signout')
let expect = chai.expect

describe('signout', function() {
    it('should return 200 if signin is successful', done => {
        var request = httpMocks.createRequest({
            headers: {
                "access-token": "fizzbuzz"
            }
        });
        var response = httpMocks.createResponse();

        AWS.mock('CognitoIdentityServiceProvider', 'globalSignOut', function(params, callback) {
            // Verify if required parameters are present in input.
            expect(params.AccessToken).to.equal('fizzbuzz');
            callback(null, 'success');
        });

        // anonymous function with done() instruction, should be send as "next".
        signOutHandler.signOut(request, response, function () {
            expect(response.statusCode).to.equal(200);
            expect(response._getJSONData().message).to.equal('Sign out successful!');
            done();
        });
        AWS.restore('CognitoIdentityServiceProvider');

    })

    it('should return 404 if signout fails', done => {
        var request = httpMocks.createRequest({
            headers: {
                "access-token": "fizzbuzz"
            }
        });
        var response = httpMocks.createResponse();

        AWS.mock('CognitoIdentityServiceProvider', 'globalSignOut', function(params, callback) {
            // Verify if required parameters are present in input.
            expect(params.AccessToken).to.equal('fizzbuzz');
            callback({error: "Unable to signout!"},null);
        });

        // anonymous function with done() instruction, should be send as "next".
        signOutHandler.signOut(request, response, function () {
            expect(response.statusCode).to.equal(404);
            expect(response._getJSONData().error).to.equal('Failed to Sign out! Try again!');
            done();
        });
        AWS.restore('CognitoIdentityServiceProvider');
    })

});
