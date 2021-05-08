var express = require('express');
var router = express.Router();

function customerInfo(req, res, next) {
  var customer_id = req.body.customer_id;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var is_admin = req.body.is_admin;
  res.status(200).json({
    customer_id: customer_id,
    firstName: first_name,
    lastName: last_name,
    isAdmin: is_admin,
  });

  return next();
}

router.post('/', customerInfo);
module.exports = router;
module.exports.customerInfo = customerInfo;

