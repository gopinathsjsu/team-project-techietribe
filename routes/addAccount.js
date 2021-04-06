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

// function for adding new customer account

function addAccount(req, res) {
  console.log('In beginning of creating a customer account ');

  // Adding customer and related information.

  var id = req.body.id;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var date_of_birth = req.body.date_of_birth;
  var gender = req.body.gender;
  var account_type = req.body.account_type;

  console.log('id: ' + id);
  console.log('first_name: ' + first_name);
  console.log('last_name: ' + last_name);
  console.log('date_of_birth: ' + date_of_birth);
  console.log('gender: ' + gender);
  console.log('account_type:' + account_type);

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    console.log('Record insert into RDS');

    connection.query(
      'INSERT INTO `Bank`.Customer(id,first_name,last_name,date_of_birth,gender,account_type) values (?,?,?,?,?,?)',
      [id, first_name, last_name, date_of_birth, gender, account_type],

      //'INSERT INTO `Bank`.Customer(id, first_name, last_name,date_of_birth,gender)VALUES("id","+first_name","+last_name","+date_of_birth","+gender")',

      function (err, result) {
        connection.release();
        if (err) {
          console.log('Error inserting records in table' + err);
          return res.status(500).send('failed to add customer !!');
        } else {
          console.log('New Customer Added Successfully');
          return res.status(200).send('New account created successfully');
        }
      }
    );
  });
}

router.post('/', addAccount);

module.exports = router;
module.exports.addAccount = addAccount;
