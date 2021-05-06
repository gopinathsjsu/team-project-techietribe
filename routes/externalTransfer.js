var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');

function externalTransferHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Techietribe',
    multipleStatements: true,
  });
  var source_id = req.body.id;
  var destination_id = req.body.destination_id;
  var amount = req.body.amount;
  var description = req.body.description;
  var payee_name = req.body.payee_name;
  var RoutingNo = req.body.RoutingNo;

  transactionId = Math.floor(100000000 + Math.random() * 900000000);
  transaction_type = "Debit";
  RoutingNo_internal = "BSPM123"
  let datetime = new Date();
  var sql =
    'select id,balance, customer_id FROM `Bank`.Account where id=?;'
  var sql1 =
    "INSERT into `Bank`.Transaction(" + 
      "id," + 
      "source_account_id," + "description," + 
      "amount," +
      "date," +
      "destination_account_id," + 
      "RoutingNo,"+ 
      "payee_name,"+
      "transaction_type"+
      ") values (?,?,?,?,?,?,?,?,?); "+
      "UPDATE `Bank`.Account SET balance =? where id=?;"
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, [ source_id ], function (err2, result) {
      if (err2) {
        console.log('failed to get the balance');
      } else {
        var result = JSON.parse(JSON.stringify(result));

        console.log(result);
        var check_source_balance = result[0].balance;
        // var balance = result[0].balance;
        // var cust_id =result[0].customer_id;
        var difference = check_source_balance - amount;

        // To Check if receiver account id is external and sender has sufficient balance
        if (
          RoutingNo != RoutingNo_internal &&
          difference > 0 &&
          result[0].id != null &&
          result[0].balance != null
        ) {
            connection.query(
                sql1,
                [
                  transactionId,
                  source_id,
                  description,
                  amount,
                  datetime,
                  destination_id,
                  RoutingNo,
                  payee_name,
                  transaction_type,
                  difference,
                  source_id,
                ],
                function (err3, result) {
                  if (err3) {
                    console.log(err3);
                  } else {
                    console.log('Transaction Done Successfully');
                  }
                }
              );
              res
                .status(200)
                .send(
                  JSON.stringify(
                    { message: 'Money Transferred Successfully!' },
                    null,
                    '\t'
                  )
                );
                  }
                else{
                    console.log("Money cannot be transferred")
                    res
                    .status(500)
                    .send(
                      JSON.stringify(
                        { message: 'Money Cannot be Transferred!' },
                        null,
                        '\t'
                      )
                    );
                }
        next();
      }
    });
  });
}
function externalTransfer(req, res, next) {
  externalTransferHelper(mySQL, req, res, next);
}
router.post('/', externalTransfer);

module.exports = router;
module.exports.externalTransferHelper = externalTransferHelper;
