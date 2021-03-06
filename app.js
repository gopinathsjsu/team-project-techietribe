var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var signUpRouter = require('./routes/signup');
var signInRouter = require('./routes/signin');
var signOutRouter = require('./routes/signout');
var verifyTokenRouter = require('./routes/verifyToken');
//var addAccountRouter = require('./routes/addAccount');
var addTransactionsHelper = require('./routes/addTransactions');
var closeAccountRouter = require('./routes/closeAccount');
var addCustomerAccountRouter = require('./routes/addCustomerAccount');
var viewTransactionsRouter = require('./routes/viewTransactions');
var searchTransactionsRouter = require('./routes/searchTransactions');
var internalTransferRouter = require('./routes/internalTransfer');
var billPaymentRouter = require('./routes/billPayment');
var externalRecurringTransferRouter = require('./routes/externalRecurringTransfer')
var externalTransferRouter = require('./routes/externalTransfer');
var recurringTransferRouter = require('./routes/recurringTransfer');
var billPaymentRecurringRouter = require('./routes/billPaymentRecurring');
var viewAccountRouter = require('./routes/viewAccount');
var getInfoRouter = require('./routes/getInfo');
//var billPaymentRouter = require('./routes/billPayment');

require('dotenv').config();
var app = express();

// view engine setup to search for html files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
//app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signUpRouter);
app.use('/signin', signInRouter);
app.use('/signout', signOutRouter);
//app.use('/verifyToken',verifyTokenRouter);
app.use('/users', usersRouter);
//app.use('/addAccount', addAccountRouter);
app.use('/addTransactions', addTransactionsHelper);
app.use('/closeAccount', closeAccountRouter);
//Adding verifyToken Router
app.use('/addCustomerAccount', addCustomerAccountRouter);
app.use('/viewTransactions', viewTransactionsRouter);
app.use('/searchTransactions', searchTransactionsRouter);
app.use('/internalTransfer', internalTransferRouter);
app.use('/externalTransfer',externalTransferRouter);
app.use('/recurringTransfer', recurringTransferRouter);
app.use('/billPayment', billPaymentRouter);
app.use('/billPaymentRecurring', billPaymentRecurringRouter);
app.use('/externalRecurringTransfer', externalRecurringTransferRouter)
//app.use('/adminTransaction', adminTransactionHelper);
//app.use('/externalTransfer', externalTransferRouter);

app.use('/viewAccount', verifyTokenRouter, viewAccountRouter);
app.use('/getInfo', verifyTokenRouter, getInfoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  if (res.headersSent) {
    return;
  }
  // If the headers are not sent then only error handler is called.
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
