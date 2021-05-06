var express = require("express");
var router = express.Router();
var mySQL = require("mysql");
const AWS = require("aws-sdk");

require("dotenv").config();
AWS.config.update({
  region: process.env["AWS_REGION"],
  accessKeyId: process.env["ACCESS_KEY_ID"],
  secretAccessKey: process.env["SECRET_ACCESS_KEY"],
});

function addCustomerToDb(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: process.env["RDS_HOST"],
    user: process.env["RDS_USER"],
    password: process.env["RDS_PASSWORD"],
  });

  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;

  console.log( "first name: " + firstname + " last name: " + lastname + " username: " + username);

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    console.log("Add customer to  data from RDS");

    // Customer id is automatically generated.
    connection.query(
      "INSERT into `Bank`.Customer(first_name,last_name,userName) values (?,?,?)",
      [firstname, lastname, username],

      function (err2, result) {
        //connection.release();
        if (err2) {
          console.log("Error in adding customer: " + JSON.stringify(err2));
          res.status(500).json({
            error: "failed to create account!",
          });
        } else {
          console.log("Successfully created user!");
          res.status(200).json({
            message: 'Succesfully registered! Signin to access the application'
          });
        }
        next();

      }
    );

  });

}

function signUpHelper(mySQLObj, req, res, next) {

  const cognito = new AWS.CognitoIdentityServiceProvider();
  var input = {
    ClientId: process.env["CLIENT_ID"],
    UserAttributes: [
      {
        Name: "name",
        Value: req.body.firstname + " " + req.body.lastname,
      },
    ],
    Username: req.body.username,
    Password: req.body.password
  };

  cognito.signUp(input, function (err, data) {
    console.log(data);
    if (err) {
      console.log("Unable to create user! Error: " + JSON.stringify(err));
      res.status(404).json({
        error: 'Failed to sign up! Try again!'
      });
      next();
    } else {
      addCustomerToDb(mySQLObj, req, res, next);
    }
  });

}

function signUp(req, res, next) {
  signUpHelper(mySQL, req, res, next);
}

router.post("/", signUp);

module.exports = router;
module.exports.signUpHelper = signUpHelper;
