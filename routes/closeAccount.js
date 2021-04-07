var express = require('express');
var router = express.Router();
var mySQL = require('mysql');
const AWS = require('aws-sdk');
var pool = mySQL.createPool({
    connectionLimit: 1000,
    host: 'cmpe202-project.czqzb1wsgkyi.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Techietribe',
});
// function for closing account
function addAccount(req, res) {
    console.log('In beginning of creating a customer account ');
    var id = req.body.id;
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(
            'DELETE FROM `Bank`.Account WHERE id =?',
            function (err, result) {
                connection.release();
                if (err) {
                    console.log('Error deleting record in table' + err);
                    return res.status(500).send('failed to delete account !!');
                } else {
                    console.log('Deleted Account Successfully');
                    return res.status(200).send('Deleted account successfully');
                }
            }
        );
    });
}
router.post('/', closeAccount);
module.exports = router;
module.exports.closeAccount = closeAccount;
