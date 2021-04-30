let express = require('express');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
chai.should();
chai.use(chaiHttp);


describe('internal transfer', () => {
    it('It should return 200 if internal transfer is successful', (done) => {
        var body = {
            customer_id: "10",
            destination_id: "20",
            amount:"1",
            description: "Test"
        };
        chai
            .request(server)
            .post('/internalTransfer')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('It should return 500 if internal transfer failed', (done) => {
        var body = {
            customer_id: "10",
            destination_id: "20",
            amount:"10000",
            description: "Test"
        };
        chai
            .request(server)
            .post('/internalTransfer')
            .send(body)
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
});
