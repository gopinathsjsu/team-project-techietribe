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
const AWS = require('aws-sdk');
var low = 150;
var high = 25000;
var cardlow = 900000;
var cardhigh = 1200000;
var accountlow = 13000001;
var accounthigh = 18000000;

var customerId = Math.floor(Math.random() * (high - low) + low);
var cardId = Math.floor(Math.random() * (cardhigh - cardlow) + cardlow);
// function for adding new customer

function addAccount(req, res) {
  console.log('In beginning of creating a customer account ');

  // Adding customer and related information.

  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var date_of_birth = req.body.date_of_birth;
  var gender = req.body.gender;
  var account_type = req.body.account_type;
  var user_pass = req.body.user_pass;

  console.log('id: ' + customerId);
  console.log('first_name: ' + first_name);
  console.log('last_name: ' + last_name);
  console.log('date_of_birth: ' + date_of_birth);
  console.log('gender: ' + gender);
  console.log('account_type:' + account_type);
  console.log('user_pass:' + user_pass);

  //if else for catching errors

  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    console.log('Record insert into RDS');

    connection.query(
      'INSERT INTO `Bank`.Customer(id,first_name,last_name,date_of_birth,gender,account_type,user_pass) values (?,?,?,?,?,?,?)',
      [
        customerId,
        first_name,
        last_name,
        date_of_birth,
        gender,
        account_type,
        user_pass,
      ],

      //'INSERT INTO `Bank`.Customer(id, first_name, last_name,date_of_birth,gender)VALUES("id","+first_name","+last_name","+date_of_birth","+gender")',

      function (err, result) {
        if (err) {
          console.log('Error inserting records in table' + err);
          return res.status(500).send('failed to add customer !!');
        } else {
          return res
            .status(200)
            .send(
              'New account created successfully for customer with id: ' +
                customerId
            );
        }
      }
    );
  });
  addToCard();

  addToAccount();
}
// function to add data in Card table
function addToCard(req, res) {
  //var cardId = Math.floor(Math.random() * (cardhigh - cardlow) + cardlow);
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
          console.log('Error inserting records in table' + err);
          return res.status(500).send('failed to add Card !!');
        } else {
          return res
            .status(200)
            .send(
              'New Card created successfully for customer with id: ' + cardId
            );
        }
      }
    );
  });
}

// function to add data in Account Table

function addToAccount(req, res) {
  // Information related to Account table
  var accountId = Math.floor(
    Math.random() * (accounthigh - accountlow) + accountlow
  );
  var customer_id = customerId;
  //var cardId = cardId;
  var balance = null;
  console.log('id: ' + accountId);
  console.log('customer_id: ' + customer_id);
  console.log('card_id: ' + cardId);
  console.log('balance: ' + balance);

  pool.getConnection(function (err, connection) {
    if (err) {
      throw err;
    }
    console.log('Record insert into RDS');

    connection.query(
      'INSERT INTO `Bank`.Account(id,customer_id,card_id,balance) values (?,?,?,?)',
      [accountId, customer_id, cardId, balance],

      function (err, result) {
        if (err) {
          console.log('Error inserting records in table' + err);
          return res.status(500).send('failed to add Account !!');
        } else {
          return res
            .status(200)
            .send(
              'New account created successfully for customer with id: ' +
                accountId
            );
        }
      }
    );
  });
}

router.post('/', addAccount);

module.exports = router;
module.exports.addAccount = addAccount;
module.exports.addToAccount = addToAccount;
module.exports.addToAccount = addToCard;
