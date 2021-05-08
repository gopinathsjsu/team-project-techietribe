var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');

function internalTransferHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Techietribe',
    multipleStatements: true,
  });
  var source_id = req.query.id;
  var destination_id = req.query.destination_id;
  var amount = req.query.amount;
  var description = req.query.description;
  var payee_name = req.query.payee_name
  var transactionId = transactionId = Math.floor(100000000 + Math.random() * 900000000);
  let datetime = new Date();
  var RoutingNo = BSPM;


  var sql =
    'select id,balance FROM `Bank`.Account where id=?;select balance from `Bank`.Account where id=?';
  var sql1 =
    'INSERT into `Bank`.Transaction(id,source_account_id,description,amount,date,destination_account_id,RoutingNo,payee_name) values (?,?,?,?,?,?,?,?);UPDATE `Bank`.Account SET balance =? where id =?;UPDATE `Bank`.Account SET balance =? where id =?';

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(sql, [destination_id, source_id], function (err2, result) {
      if (err2) {
        console.log('failed to get the balance');
      } else {
        var result = JSON.parse(JSON.stringify(result));

        console.log(result);
        // if(result[0][0].id == null || result[0][0].balance == null || result[1][0].balance == null)
        console.log("Result: " + result);
        var check_dest_id = result[0][0].id;

        var check_dest_balance = result[0][0].balance;
        var check_source_balance = result[1][0].balance;

        var difference = check_source_balance - amount;
        var addition = check_dest_balance + amount;

        //Check if receiver account id exists and sender has sufficient balance
        if (
          check_dest_id == null ||
          difference < 0 ||
          result[0][0].id == null ||
          result[0][0].balance == null ||
          result[1][0].balance == null
        ) {
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
              source_id,
              description,
              amount,
              datetime,
              destination_id,
              RoutingNo,
              payee_name,
              difference,
              source_id,
              addition,
              destination_id,
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
        // res.status(200).send(JSON.stringify({message: "Money Transferred Successfully!"}, null, '\t'))
        next();
      }
    });
  });
}
function internalTransfer(req, res, next) {
  internalTransferHelper(mySQL, req, res, next);
}

router.post('/', internalTransfer);

module.exports = router;
module.exports.internalTransferHelper = internalTransferHelper;
