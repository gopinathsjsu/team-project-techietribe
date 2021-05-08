var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');

function billPaymentHelper(mySQLObj, req, res, next) {
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
  //var description = req.body.description;
  var payee_name = req.body.payee_name;
  //var RoutingNo = req.body.RoutingNo;

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
      "payee_name,"+
      ") values (?,?,?,?,?,?); "+
      "UPDATE `Bank`.Account SET balance =? where id=?;"
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, [ source_id ], function (err2, result) {
      if (err2) {
        console.log('failed to get the balance');
      } else {
        var result = JSON.parse(JSON.stringify(result));

        console.log("Results are "+result);
        var check_source_balance = result[0].balance;
        //var balance = result[0].balance;
        // var cust_id =result[0].customer_id;
        var difference = check_source_balance - amount;
        
        {
            connection.query(
                sql1,
                [
                  transactionId,
                  source_id,
                  description,
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
                    console.log('External One-time transfer Done Successfully');
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
