var express = require('express');
var router = express.Router();
var mySQL = require('mysql');

var pool = mySQL.createPool({
  connectionLimit: 1000,
  host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Techietribe',
  //database: 'cmpe202-project',
});
var high = 1000;
var low = 1;
var transactionId = Math.floor(Math.random() * (high - low) + low);
const AWS = require('aws-sdk');

// ADDING MANUAL TRANSCATIONS LIKE TAXES AND ALL

function addTransaction(req, res) {
  console.log('In beginning of adding manual transactions!!');

  var id = transactionId;
  var account_id = req.query.account_id;
  var description = req.query.description;
  var amount = req.query.amount;
  var date = req.query.date;

  console.log('id: ' + id);
  console.log('account_id: ' + account_id);
  console.log('description: ' + description);
  console.log('amount: ' + amount);
  console.log('date: ' + date);

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    console.log('Record insert into RDS');

    connection.query(
      'INSERT INTO `Bank`.Transaction(id,account_id,description,amount,date) values (?,?,?,?,?)',
      [id, account_id, description, amount, date],

      function (err, result) {
        //connection.release();
        if (err) {
          console.log('Error inserting records in table' + err);
          return res.status(500).send('failed to add new Transaction !!');
        } else {
          console.log(
            'New Transaction Added Successfully with TransactionId:' + id
          );
          return res
            .status(200)
            .send(JSON.stringify({ message: 'success' }, null, '\t'));
        }
      }
    );
  });
}
router.post('/', addTransaction);
module.exports = router;
module.exports.addTransaction = addTransaction;
