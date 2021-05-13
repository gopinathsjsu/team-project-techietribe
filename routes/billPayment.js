var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');

function billPaymentHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: process.env["RDS_HOST"],
    user: process.env["RDS_USER"],
    password: process.env["RDS_PASSWORD"],
    multipleStatements: true
  });
  var source_id = req.body.account_id_1;
  var destination_id = req.body.destination_id;
  var amount = req.body.amount;
  
  var payee_name = req.body.payee_name;

  transactionId = Math.floor(100000000 + Math.random() * 900000000);
  let datetime = new Date();
  var sql =
    'select id,balance, customer_id FROM `Bank`.Account where id=?;'
  var sql1 =
    "INSERT into `Bank`.Transaction(" + 
      "id," + 
      "source_account_id," + 
      "amount," +
      "date," +
      "destination_account_id," + 
      "payee_name"+
      ") values (?,?,?,?,?,?); "+
      "UPDATE `Bank`.Account SET balance =? where id=?;"
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, [ source_id ], function (err2, result) {
      if (err2) {
        console.log('failed to get the balance');
      } else {
        var result = JSON.stringify(result);

        console.log("Results are "+result);
        var check_source_balance = result[0].balance;
        //var balance = result[0].balance;
        // var cust_id =result[0].customer_id;
        var difference = parseInt(check_source_balance) - parseInt(amount);
        
        {
            connection.query(
                sql1,
                [
                  transactionId,
                  source_id,
                  amount,
                  datetime,
                  destination_id,
                  payee_name,
                  difference,
                  source_id,
                ],
                function (err3, result) {
                  if (err3) {
                    console.log(err3);
                  } else {
                    console.log('One-time Bill Payment Done Successfully');
                  }
                }
              );
              res
                .status(200)
                .send(
                  JSON.stringify(
                    { message: 'Bill Payment Successful!' },
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
function billPayment(req, res, next) {
  billPaymentHelper(mySQL, req, res, next);
}
router.post('/', billPayment);

module.exports = router;
module.exports.billPaymentHelper = billPaymentHelper;
