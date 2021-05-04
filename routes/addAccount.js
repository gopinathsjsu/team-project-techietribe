var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');

var pool = mySQL.createPool({
  connectionLimit: 1000,
  host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Techietribe',
});

var low = 150;
var high = 2500;
var cardlow = 2600;
var cardhigh = 5500;
var accountlow = 5510;
var accounthigh = 9500;

var customerId = Math.floor(Math.random() * (high - low) + low);
var cardId = Math.floor(Math.random() * (cardhigh - cardlow) + cardlow);

function addAccount(req, res) {
  console.log('In beginning of creating a customer account');

  // Adding customer related data

  var first_name = req.query.first_name;
  var last_name = req.query.last_name;
  var date_of_birth = req.query.date_of_birth;
  var gender = req.query.gender;
  var RoutingNo = 'BPSM123';

  console.log('id: ' + customerId);
  console.log('first_name: ' + first_name);
  console.log('last_name: ' + last_name);
  console.log('date_of_birth: ' + date_of_birth);
  console.log('gender: ' + gender);
  console.log('RoutingNo:' + RoutingNo);

  //if else for catching errors

  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    console.log('Record insert into RDS');

    connection.query(
      'INSERT INTO `Bank`.Customer(id,first_name,last_name,date_of_birth,gender,RoutingNo) values (?,?,?,?,?,?)',
      [customerId, first_name, last_name, date_of_birth, gender, RoutingNo],

      function (err, result) {
        if (err) {
          console.log('Error inserting records in Customer table' + err);
        } else {
          console.log(
            'New customer record inserted successfully in Customer Table '
          );
        }
      }
    );
  });

  addToCard(req, res);
  addToAccount(req, res);
}

// function to add data in Card table
function addToCard(req, res) {
  var number = cardId;

  var expiration_date = new Date(2037, 2, 7);
  var is_blocked = 0;
  console.log('id: ' + cardId);
  console.log('number: ' + number);
  console.log('expiration_date: ' + expiration_date);
  console.log('is_blocked: ' + is_blocked);

  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    console.log('Record insert into RDS');

    connection.query(
      'INSERT INTO `Bank`.Card(id,number,expiration_date,is_blocked) values (?,?,?,?)',
      [cardId, number, expiration_date, is_blocked],

      function (err, result) {
        if (err) {
          console.log('Error while inserting records in Cards table' + err);
        } else {
          console.log('New Card record inserted successfully in Cards Table');
        }
      }
    );
  });
}

// function to add data in Account Table

function addToAccount(req, res) {
  var accountId = Math.floor(
    Math.random() * (accounthigh - accountlow) + accountlow
  );
  var customer_id = customerId;
  //var cardId = cardId;
  var balance = null;
  var account_type = req.query.account_type;
  console.log('id: ' + accountId);
  console.log('customer_id: ' + customer_id);
  console.log('card_id: ' + cardId);
  console.log('balance: ' + balance);
  console.log('account_type:' + account_type);

  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    console.log('Record insert into RDS');

    connection.query(
      'INSERT INTO `Bank`.Account(id,customer_id,card_id,balance,account_type) values (?,?,?,?,?)',
      [accountId, customer_id, cardId, balance, account_type],

      function (err, result) {
        if (err) {
          console.log('Error inserting records in table' + err);
          return res.status(500).send('failed to add Account !!');
        } else {
          connection.release();
          console.log(
            'Account Created  Successfully for Customer with customerId:' +
              customerId
          );
          console.log(
            'record inserted response from DB:' + JSON.stringify(result)
          );
          res
            .status(200)
            .send(JSON.stringify({ message: 'success' }, null, '\t'));
        }
      }
    );
  });
}

router.post('/', addAccount);

module.exports = router;
module.exports.addAccount = addAccount;
