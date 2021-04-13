var express = require("express");
var router = express.Router();
const AWS = require("aws-sdk");

require("dotenv").config();
AWS.config.update({
  region: process.env["AWS_REGION"],
  accessKeyId: process.env["ACCESS_KEY_ID"],
  secretAccessKey: process.env["SECRET_ACCESS_KEY"],
});

function signInUser(req, res, next) {
  const cognito = new AWS.CognitoIdentityServiceProvider();
  var input = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env["CLIENT_ID"],
    AuthParameters: {
      USERNAME: req.body.username,
      PASSWORD: req.body.password,
    },
  };

  cognito.initiateAuth(input, function (err, data) {
    if (err) {
      console.log("Unable to login! Error: " + JSON.stringify(err));
      res.status(404).json({
        error: 'Failed to sign in! Try again!'
      });
    } else {
      console.log("Login is successful: " + JSON.stringify(data));
      res.status(200).json({
        message: 'Signin is succesful!',
        accessToken: data.AuthenticationResult.AccessToken,
        isAdmin: req.body.username == process.env["ADMIN_USER_NAME"]
      });
    }
    return next();
  });
}

router.post("/", signInUser);

module.exports = router;
