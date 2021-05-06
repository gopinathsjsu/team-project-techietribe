var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET add new account page */
router.get('/addAccount', function (req, res, next) {
  res.render('addAccount', { title: 'Express' });
});

/* GET add  Manual Transaction page */
router.get('/addTransaction', function (req, res, next) {
  res.render('addTransaction', { title: 'Express' });
});
/* external transfer page */
router.get('/externalTransfer', function (req, res, next) {
  res.render('externalTransfer', { title: 'Express' });
});
/* external transfer page */
router.get('/recurringTransfer', function (req, res, next) {
  res.render('recurringTransfer', { title: 'Express' });
});
module.exports = router;
