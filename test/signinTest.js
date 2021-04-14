let httpMocks = require('node-mocks-http');
let chai = require('chai')
const AWS = require('aws-sdk-mock');
let signInHandler = require('../routes/signin')
let expect = chai.expect

describe('signin', function() {
    it('should return 200 if signin is successful', done => {
        var request = httpMocks.createRequest({
            body: {
                username: "user1",
                password: "nopassword"
            }
        });
        var response = httpMocks.createResponse();

        AWS.mock('CognitoIdentityServiceProvider', 'initiateAuth', function(params, callback) {
            // Verify if required parameters are present in input.
            expect(params.AuthFlow).to.not.be.empty;
            expect(params.ClientId).to.not.be.empty;
            expect(params.AuthParameters.USERNAME).to.equal('user1');
            expect(params.AuthParameters.PASSWORD).to.equal('nopassword');
            callback(null, {AuthenticationResult:{AccessToken: "fizzbuzz"}});
        });

        // anonymous function with done() instruction, should be send as "next".
        signInHandler.signInUser(request, response, function () {
            expect(response.statusCode).to.equal(200);
            expect(response._getJSONData().message).to.equal('Signin is succesful!');
            expect(response._getJSONData().accessToken).to.equal('fizzbuzz');
            expect(response._getJSONData().isAdmin).to.be.false;
            done();
        });
        AWS.restore('CognitoIdentityServiceProvider');

    })

    it('should return 404 if signin fails', done => {
        var request = httpMocks.createRequest({
            body: {
                username: "user1",
                password: "nopassword"
            }
        });
        var response = httpMocks.createResponse();

        AWS.mock('CognitoIdentityServiceProvider', 'initiateAuth', function(params, callback) {
            // Verify if required parameters are present in input.
            expect(params.AuthFlow).to.not.be.empty;
            expect(params.ClientId).to.not.be.empty;
            expect(params.AuthParameters.USERNAME).to.equal('user1');
            expect(params.AuthParameters.PASSWORD).to.equal('nopassword');
            callback({error: "Unable to signin!"}, null);
        });

        // anonymous function with done() instruction, should be send as "next".
        signInHandler.signInUser(request, response, function () {
            expect(response.statusCode).to.equal(404);
            expect(response._getJSONData().error).to.equal('Failed to sign in! Try again!');
            done();
        });
        AWS.restore('CognitoIdentityServiceProvider');
    })

});
