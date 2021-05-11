var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');
const cron = require("node-cron");
function recurringTransferHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Techietribe',
    multipleStatements: true,
  });
  var source_id = req.body.account_id_1;
  var dest_id = req.body.destination_id;
  var amount = req.body.amount;
  var description = req.body.description;
  var recur_after = req.body.recur_after;
  var next_transfer_date =req.body.next_transfer_date;

  // var dd = String(today.getDate()).padStart(2, '0');
  // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  // var yyyy = today.getFullYear();
  // // var datetime = new Date();
  // // console.log("datetime:"+datetime);

  // today = mm + '-' + dd + '-' + yyyy;
  // document.write(today);
  // console.log("today is :"+today)
  console.log("++++++++++++++++++++++++++++++++++++++")
  // var description = req.body.description;
  // var payee_name = req.body.payee_name;
  // var RoutingNo = req.body.RoutingNo;
//"next_transfer_date,"+
  transactionId = Math.floor(100000000 + Math.random() * 900000000);
//   transaction_type = "Debit";
  routingNo = "BSPM123"; 
  routingNo_internal = "BSPM123";
  let datetime = new Date();
  var today = datetime;
  console.log("datetime:"+datetime)
  var sql = 'select *  FROM `Bank`.Recurring;'
    console.log("sql executed")
  var sql1 =
  "INSERT into `Bank`.Recurring  (" +
  "sender_id,"+
  "dest_id,"+
  "routingNo,"+
  "description,"+
  "next_transfer_date,"+
  "recur_after,"+
  "amount"+
  ") values (?,?,?,?,?,?,?);"

  console.log("second sql executed")
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE ")
    connection.query(sql, [ source_id ], function (err2, result) {
      if (err2) {
        console.log('failed to get the recurring table');
      } else {
         var result = JSON.parse(JSON.stringify(result));

        console.log(result);
        

        // To Check if receiver account id is external and sender has sufficient balance
        if (
          routingNo = routingNo_internal 
         
        ) {
            connection.query(
                sql1,
                [
                    source_id,
                    dest_id, 
                    routingNo,
                    description,
                    next_transfer_date,
                    recur_after,
                    amount 
                ],
                function (err3, result) {
                  if (err3) {
                    console.log(err3);
                  } else {
                    console.log('Recurring payment set Successfully');
                  }
                }
              );
              res
                .status(200)
                .send(
                  JSON.stringify(
                    { message: 'Recurring payment set Successfully' },
                    null,
                    '\t'
                  )
                );
                  }
                else{
                    console.log("Recurring payment cannot be set ")
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
function recurringTransfer(req, res, next) {
  recurringTransferHelper(mySQL, req, res, next);
}
router.post('/', recurringTransfer);

module.exports = router;
module.exports.recurringTransferHelper = recurringTransferHelper;