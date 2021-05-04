let express = require('express');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
chai.should();
chai.use(chaiHttp);


describe('external transfer', () => {
    it('It will return 200 if successful', (done) => {
        var body = {
            id:"5689",
            destination_id:"503",
            amount:100,
            description:"Testing the external transfer",
            payee_name:"Test ",
            RoutingNo:"TEST123"
        };
        chai
            .request(server)
            .post('/externalTransfer')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Will return 500 if external transfer fails', (done) => {
        var body = {
            id:"5689",
            destination_id:"503",
            amount:100,
            description:"Testing the external transfer",
            payee_name:"Test ",
            RoutingNo:"TEST123"
        };
        chai
            .request(server)
            .post('/externalTransfer')
            .send(body)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
});
