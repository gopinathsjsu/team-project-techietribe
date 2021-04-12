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
var high = 1500000000000;
var low = 100000000000;
const AWS = require('aws-sdk');

// ADDING MANUAL TRANSCATIONS LIKE TAXES AND ALL

function addTransaction(req, res) {
  console.log('In beginning of adding manual transactions!!');

  var id = req.body.id;
  var account_id = req.body.account_id;
  var description = req.body.description;
  var amount = req.body.amount;
  var date = req.body.date;

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
            'New Transaction Added Successfully with TransactionId!!'
          );
          return res.status(200).send('New Transaction Added successfully');
        }
      }
    );
  });
}
router.post('/', addTransaction);
module.exports = router;
module.exports.addTransaction = addTransaction;
