let httpMocks = require('node-mocks-http');
let chai = require('chai')
const AWS = require('aws-sdk-mock');
let signUpHandler = require('../routes/signup')
let expect = chai.expect

describe('signup', function() {
    it('should return 200 if signup is successful', done => {
        var request = httpMocks.createRequest({
            body: {
                fullname: "test1",
                username: "user1",
                password: "nopassword"
            }
        });
        var response = httpMocks.createResponse();

        AWS.mock('CognitoIdentityServiceProvider', 'signUp', function(params, callback) {
            // Verify if required parameters are present in input.
            expect(params.ClientId).to.not.be.empty;
            expect(params.UserAttributes[0].Value).to.equal('test1');
            expect(params.Username).to.equal('user1');
            expect(params.Password).to.equal('nopassword');
            callback(null, 'success');
        });

        // anonymous function with done() instruction, should be send as "next".
        signUpHandler.signUp(request, response, function () {
            expect(response.statusCode).to.equal(200);
            expect(response._getJSONData().message).to.equal('Succesfully registered! Signin to access the application');
            done();
        });
        AWS.restore('CognitoIdentityServiceProvider');

    })

    it('should return 404 if signup fails', done => {
        var request = httpMocks.createRequest({
            body: {
                fullname: "test1",
                username: "user1",
                password: "nopassword"
            }
        });
        var response = httpMocks.createResponse();

        AWS.mock('CognitoIdentityServiceProvider', 'signUp', function(params, callback) {
            // Verify if required parameters are present in input.
            expect(params.ClientId).to.not.be.empty;
            expect(params.UserAttributes[0].Value).to.equal('test1');
            expect(params.Username).to.equal('user1');
            expect(params.Password).to.equal('nopassword');
            callback({error: "Unable to signup!"}, null);
        });

        // anonymous function with done() instruction, should be send as "next".
        signUpHandler.signUp(request, response, function () {
            expect(response.statusCode).to.equal(404);
            expect(response._getJSONData().error).to.equal('Failed to sign up! Try again!');
            done();
        });

        AWS.restore('CognitoIdentityServiceProvider');
    })

});
