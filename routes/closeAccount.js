var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');

function closeAccountHelper(mySQLObj, req, res, next) {
    var pool = mySQLObj.createPool({
        connectionLimit: 1000,
        host: "cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "Techietribe",
        multipleStatements: true
    });
    
    var id = req.body.id;
    var sql = "DELETE FROM `Bank`.Account WHERE id =?;DELETE FROM `Bank`.Card WHERE id in (select card_id from `Bank`.Account WHERE id = ?) ";

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(
            sql,
            [id, id], function (err2, result) {
                //connection.release();
                if (err2) {
                    console.log("Close Account Failed" + JSON.stringify(err2));
                    res.status(500).json({
                        error: "failed to close account",
                    });
                } else {
                    console.log("Close Account Successfully" + result.length);
                    res.status(200).send(JSON.stringify({message: "success"}, null, '\t'))

                }
                next();

            }
        );
    });
}

function closeAccount(req, res, next) {
    closeAccountHelper(mySQL, req, res, next);
}

router.post('/', closeAccount);

module.exports = router;
module.exports.closeAccountHelper = closeAccountHelper;

