var express = require("express");
var router = express.Router();
var mySQL = require("mysql");
require("dotenv").config();

function searchTransactionsHelper(mySQLObj, req, res, next) {
  var pool = mySQLObj.createPool({
    connectionLimit: 1000,
    host: process.env["RDS_HOST"],
    user: process.env["RDS_USER"],
    password: process.env["RDS_PASSWORD"],
  });

  var account_id = req.body.account_id;
  var keyword = req.body.keyword;

  console.log("account_id: " + account_id + "keyword: " + keyword);

  pool.getConnection(function (err, connection) {
    if (err) throw err;

    console.log("Get data from RDS");
    connection.query(
      "SELECT id, account_id, description, amount, date FROM `Bank`.Transaction WHERE account_id = ? AND description LIKE ?",
      [account_id, "%" + keyword + "%"],

      function (err2, result) {
        //connection.release();
        if (err2) {
          console.log("Error in searching records: " + JSON.stringify(err2));
          res.status(500).json({
            error: "failed to search transactions",
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

function searchTransactions(req, res, next) {
  searchTransactionsHelper(mySQL, req, res, next);
}

router.get("/", searchTransactions);
module.exports = router;
module.exports.searchTransactionsHelper = searchTransactionsHelper;
