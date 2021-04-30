var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');

function adminTransactionHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Techietribe',
    multipleStatements: true,
  });
  var source_account_id = req.body.source_account_id;
  var destination_account_id = req.body.destination_account_id;
  var amount = req.body.amount;
  var description = req.body.description;
  var date = req.body.date;

  var high = 1000;
  var low = 1;
  var transactionId = Math.floor(Math.random() * (high - low) + low);

  //let datetime = new Date();
  var sql =
    'select id,balance FROM `Bank`.Account where id=?;select balance from `Bank`.Account where id=?';
  var sql1 =
    'INSERT into `Bank`.Transaction(id,source_account_id,description,amount,date,destination_account_id) values (?,?,?,?,?,?);UPDATE `Bank`.Account SET balance =? where id =?;UPDATE `Bank`.Account SET balance =? where id =?';

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(
      sql,
      [destination_account_id, source_account_id],
      function (err2, result) {
        if (err2) {
          console.log('failed to get the balance');
        } else {
          var result1 = JSON.stringify(result);
          console.log(result1);
          var check_dest_id = result[0][0].id;
          var check_dest_balance = result[0][0].balance;
          var check_source_balance = result[1][0].balance;
          var difference = check_source_balance - amount;
          var addition = check_dest_balance + amount;

          //Check if receiver account id exists and sender has sufficient balance
          if (check_dest_id == null || difference < 0) {
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
                source_account_id,
                description,
                amount,
                date,
                destination_account_id,
                difference,
                source_account_id,
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
      }
    );
  });
}
function adminTransaction(req, res, next) {
  adminTransactionHelper(mySQL, req, res, next);
}

router.post('/', adminTransaction);

module.exports = router;
module.exports.adminTransactionHelper = adminTransactionHelper;
