var express = require("express");
var router = express.Router();
const AWS = require("aws-sdk");

require("dotenv").config();
AWS.config.update({
  region: process.env["AWS_REGION"],
  accessKeyId: process.env["ACCESS_KEY_ID"],
  secretAccessKey: process.env["SECRET_ACCESS_KEY"],
});

function signOut(req, res, next) {
  console.log('access token: ' + req.get('access-token'));  
  const cognito = new AWS.CognitoIdentityServiceProvider();
  var input = {
    AccessToken: req.get('access-token')
  };

  cognito.globalSignOut(input, function (err, data) {
    console.log(data);
    if (err) {
      console.log("Unable to logout! Error: " + JSON.stringify(err));
      res.status(404).json({
        error: "Failed to Sign out! Try again!",
      });
    } else {
      console.log("Logout is successful!");
      res.status(200).json({
        message: "Sign out successful!",
      });
    }
    return next();
  });
}

router.post("/", signOut);

module.exports = router;
module.exports.signOut = signOut;
