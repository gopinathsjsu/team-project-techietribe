var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');
const cron = require("node-cron");
//const express = require("express");
  
//app = express(); // Initializing app
  
// Creating a cron job which runs on every 10 minuites
// cron.schedule("*/10 * * * *", function() {
//     console.log("running a task every 10 mins");
// });
  
//app.listen(3000);
function recurringTransferHelper(mySQLObj, req, res, next) {
    var pool = mySQLObj.createPool({
      connectionLimit: 1000,
      host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
      user: 'admin',
      password: 'Techietribe',
      multipleStatements: true,
    });
    var source_id = req.body.account_id_1;
    var destination_id = req.body.destination_id;
    var amount = req.body.amount;
    var description = req.body.description;
    var payee_name = req.body.payee_name
    var RoutingNo = req.body.RoutingNo;
  
    // transactionId = Math.floor(100000000 + Math.random() * 900000000);
    // let datetime = new Date();
    var sql = 'select *  FROM `Bank`.Recurring;'
    console.log(" in sql")
    pool.getConnection(function (err, connection) {
        console.log(" in pool")
      if (err) throw err;
      //connection.query(sql, [source_id ][destination_id], function (err2, result) {
        connection.query(sql,  function (err2, result, fields) {
        if (err2) {
          console.log('failed to get the value');
        } else {
          var result = JSON.parse(JSON.stringify(result));
          console.log("ggggggggggggggggggggggggggg")  
          console.log(result);
          res.JSON({'message' : 'ok'})
        
       
        }
      });
    });
  }
  function recurringTransfer(req, res, next) {
    recurringTransferHelper(mySQL, req, res, next);
  }
  router.post('/', recurringTransfer);
  module.exports = router;
  module.exports.recurringTransferHelper = recurringTransferHelper;

 