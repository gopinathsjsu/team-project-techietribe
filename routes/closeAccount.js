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

function closeAccount(req, res) {
    var id = req.body.customer_id;
    var cardId = req.body.card_id;
    console.log('***** Close Account ***** ');
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(
            'DELETE FROM `Bank`.Account WHERE id =? AND Card_id=?', [id, cardId],
            function (err, result) {
                //connection.release();
                if (err) {
                    console.log('Error deleting record in table' + err);
                    return res.status(500).send('failed to delete account !!');
                }
            }
        );
        connection.query(
            'DELETE FROM `Bank`.Customer WHERE id =?', id,
            function (err, result) {
                //connection.release();
                if (err) {
                    console.log('Error deleting record in table' + err);
                    return res.status(500).send('failed to delete account !!');
                }
            }
        );
        connection.query(
            'DELETE FROM `Bank`.Card WHERE id =?', cardId,
            function (err, result) {
                //connection.release();
                if (err) {
                    console.log('Error deleting record in table' + err);
                    return res.status(500).send('failed to delete account !!');
                }
            }
        );
        connection.release();
        console.log("deleted successfully")
        return res.status(200).send(JSON.stringify({message: "success"},null,'\t'))
    });
}

router.post('/', closeAccount);

module.exports = router;
module.exports.closeAccount = closeAccount;
