var express = require("express");
var router = express.Router();
var mySQL = require("mysql");
require("dotenv").config();

function viewTransactionsHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: process.env["RDS_HOST"],
    user: process.env["RDS_USER"],
    password: process.env["RDS_PASSWORD"],
  });

  console.log(req.query);

  var account_id = req.query.account_id;
  var startDate = req.query.startdate;
  var endDate = req.query.enddate;

  console.log( "account_id: " + account_id + " Start date: " + startDate + " End date: " + endDate);

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    console.log("Get data from RDS");
    connection.query(
      "SELECT id,source_account_id,destination_account_id,description,amount,date,payee_name FROM `Bank`.Transaction WHERE (source_account_id = ? OR destination_account_id = ? ) AND date >= ? AND date <= ? ORDER BY date",
      [account_id, account_id,startDate, endDate],

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
