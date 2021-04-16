var express = require("express");
var router = express.Router();
var mySQL = require("mysql");

function viewTransactionsHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: "cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "Techietribe",
  });

  var account_id = req.body.account_id;
  var startDate = req.body.startdate;
  var endDate = req.body.enddate;

  console.log( "account_id: " + account_id + " Start date: " + startDate + " End date: " + endDate);

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    console.log("Get data from RDS");
    connection.query(
      "SELECT id,account_id,description,amount,date FROM `Bank`.Transaction WHERE account_id = ? AND date >= ? AND date <= ?",
      [account_id, startDate, endDate],

      function (err2, result) {
        //connection.release();
        if (err2) {
          console.log("Error in retrieving records: " + JSON.stringify(err2));
          res.status(500).json({
            error: "failed to retrieve transactions",
          });
        } else {
          console.log("Transactions retrieved: " + result.length);
          res.status(200).json(result);
        }
        next();

      }
    );
  });
}

function viewTransactions(req, res, next) {
  viewTransactionsHelper(mySQL, req, res, next);
}

router.get("/", viewTransactions);
module.exports = router;
module.exports.viewTransactionsHelper = viewTransactionsHelper;
