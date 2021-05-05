var express = require("express");
var router = express.Router();
var request = require("request");
var jwt = require("jsonwebtoken");
var jwkToPem = require("jwk-to-pem");
const AWS = require("aws-sdk");
var mySQL = require("mysql");

require("dotenv").config();
AWS.config.update({
  region: process.env["AWS_REGION"],
  accessKeyId: process.env["ACCESS_KEY_ID"],
  secretAccessKey: process.env["SECRET_ACCESS_KEY"],
});

function populateUserId(req, res, next){
  var pool = mySQL.createPool({
    connectionLimit: 1000,
    host: process.env["RDS_HOST"],
    user: process.env["RDS_USER"],
    password: process.env["RDS_PASSWORD"],
  });

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    console.log("Get data from RDS");
    connection.query(
      "SELECT id,first_name,last_name FROM `Bank`.Customer WHERE userName = ?",
      [req.body.username],

      function (err2, result) {
        //connection.release();
        if (err2) {
          console.log("Error in retrieving customer details: " + JSON.stringify(err2));
          res.status(401).json({
            error: "Please login again!",
            redirectToLogin: true
          });
        } else {
          console.log("Customer details retrieved from db: " + JSON.stringify(result));
          req.body.id = result[0].id;
          req.body.first_name = result[0].first_name;
          req.body.last_name = result[0].last_name;
        }
        next();

      }
    );
  });


}

function verifyToken(req, res, next) {
  var token = req.get("access-token");
  console.log("Inside verify token: " + token);
  if (!token || token == '') {
    res.status(401).json({
      error: "Please login again!",
      redirectToLogin: true
    });
    // res.render('index', { signInErrMsg: "Please login!" });
    return;
  }

  var options = {
    method: "GET",
    url: "https://cognito-idp." + process.env["AWS_REGION"] + ".amazonaws.com/" + process.env["USER_POOL_ID"] + "/.well-known/jwks.json",
    json: true,
  };
  request(options, function (error, response, body) {
    if (error || response.statusCode != 200) {
      console.log("Failed to download JWKs : " + error);
      res.status(401).json({
        error: "Please login again!",
        redirectToLogin: true
      });
      //res.render('index', { signInErrMsg: "Unknown error! Please login again!" });
      return;
    }

    // Decode the token to get the associated pem!
    var decodedJwt = jwt.decode(token, { complete: true });
    if (!decodedJwt) {
      console.log("Not a valid JWT token");
      res.status(401).json({
        error: "Please login again!",
        redirectToLogin: true
      });
      // res.render('index', { signInErrMsg: "Please login again!" });
      return;
    }
    console.log(decodedJwt);

    var pem = {};
    var keys = body["keys"];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].kid === decodedJwt.header.kid) {
        pem = jwkToPem(keys[i]);
        break;
      }
    }
    // Verify the token!
    jwt.verify(token, pem, function (err, decoded) {
      if (err) {
        console.log("Unable to verify JWT token: " + err);
        res.status(401).json({
          err: "Session expired! Please login again!",
          redirectToLogin: true
        });
        // res.render('index', { signInErrMsg: "Session expired! Please login again!" });
        return;
      }


  const cognito = new AWS.CognitoIdentityServiceProvider();
      // check if user signed out already or not!
      cognito.getUser( {AccessToken: token}, function(error2, data) {
        if (error2) { 
          console.log("Invalid user session: " + error2);
          res.status(401).json({
            err: "Invalid session! Please login again!",
            redirectToLogin: true
          });
          // res.render('index', { signInErrMsg: "Invalid session! Please login again!" });
          return; 
        }
        // Verified token successfully!
        console.log("Successfully verified token!");
        // populate request with username
        req.body.username = data.Username;
        req.body.is_admin = (data.Username == process.env["ADMIN_USER_NAME"])

        populateUserId(req, res, next)

      });
    });
  });
}

router.use(verifyToken);
// router.post("/", verifyToken);
module.exports = router;
