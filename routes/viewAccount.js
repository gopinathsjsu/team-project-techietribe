var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
require('dotenv').config();

function viewAccountHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Techietribe',
  });

  var customer_id = req.query.customer_id;

  console.log('Customer-id: ' + customer_id);

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    console.log('Getting data from Account Table');
    connection.query(
      'SELECT * FROM `Bank`.Account WHERE customer_id = ? ',
      [customer_id],

      function (err2, result) {
        if (err2) {
          console.log(
            'Error in retrieving Account Details: ' + JSON.stringify(err2)
          );
          res.status(500).json({
            error: 'failed to view Account',
          });
        } else {
          console.log('Account Details retrieved: ' + result.length);
          res.status(200).json(result);
        }
        next();
      }
    );
  });
}

function viewAccount(req, res, next) {
  viewAccountHelper(mySQL, req, res, next);
}

router.get('/', viewAccount);
module.exports = router;
module.exports.viewAccountHelper = viewAccountHelper;
