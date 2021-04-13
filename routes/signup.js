var express = require("express");
var router = express.Router();
const AWS = require("aws-sdk");

require("dotenv").config();
AWS.config.update({
  region: process.env["AWS_REGION"],
  accessKeyId: process.env["ACCESS_KEY_ID"],
  secretAccessKey: process.env["SECRET_ACCESS_KEY"],
});

function signUp(req, res, next) {


  const cognito = new AWS.CognitoIdentityServiceProvider();
  var input = {
    ClientId: process.env["CLIENT_ID"],
    UserAttributes: [
      {
        Name: "name",
        Value: req.body.fullname,
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
    } else {
      console.log("Successfully created user!");
      res.status(200).json({
        message: 'Succesfully registered! Signin to access the application'
      });
    }
    return next();
  });


}

router.post("/", signUp);

module.exports = router;
