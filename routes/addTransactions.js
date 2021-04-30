var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');

function addTransactionsHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Techietribe',
    multipleStatements: true,
  });

  var destination_account_id = req.body.destination_account_id;
  var amount = req.body.amount;
  var description = req.body.description;
  var date = req.body.date;

  var high = 1000;
  var low = 1;
  var transactionId = Math.floor(Math.random() * (high - low) + low);

  var sql = 'select id,balance FROM `Bank`.Account where id=?';
  var sql1 =
    'INSERT into `Bank`.Transaction(id,source_account_id,description,amount,date,destination_account_id) values (?,?,?,?,?,?);UPDATE `Bank`.Account SET balance =? where id =?';

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, [destination_account_id], function (err2, result) {
      if (err2) {
        console.log('failed to get the transaction data');
      } else {
        var result1 = JSON.parse(JSON.stringify(result));
        console.log(result1);
        var check_dest_id = result[0].id;
        var check_dest_balance = result[0].balance;
        var addition = check_dest_balance + amount;

        //Check if destination account id exists
        if (check_dest_id == null) {
          res
            .status(500)
            .send(
              JSON.stringify(
                { message: 'Money Cannot be Transferred!' },
                null,
                '\t'
              )
            );
        } else {
          connection.query(
            sql1,
            [
              transactionId,
              null,
              description,
              amount,
              date,
              destination_account_id,
              //difference,
              addition,
              destination_account_id,
            ],
            function (err3, result) {
              if (err3) {
                console.log(err3);
              } else {
                console.log('Transaction Done Successfully');
              }
            }
          );
        }
        res
          .status(200)
          .send(
            JSON.stringify(
              { message: 'Money Transferred Successfully!' },
              null,
              '\t'
            )
          );
        next();
      }
    });
  });
}
function addTransactions(req, res, next) {
  addTransactionsHelper(mySQL, req, res, next);
}

router.post('/', addTransactions);

module.exports = router;
module.exports.addTransactionsHelper = addTransactionsHelper;
