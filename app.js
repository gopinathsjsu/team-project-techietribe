var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addAccountRouter = require('./routes/addAccount');
var addTransactionRouter = require('./routes/addTransactions');
<<<<<<< HEAD
// var newaddAccountRouter = require('./routes/newaddAccount');
=======
var closeAccountRouter = require('./routes/closeAccount');
>>>>>>> 7eb8459... Close Account,Card,Account

require('dotenv').config()
var app = express();

// view engine setup
<<<<<<< HEAD

app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
=======
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
>>>>>>> 7eb8459... Close Account,Card,Account

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/addAccount', addAccountRouter);
app.use('/addTransaction', addTransactionRouter);
<<<<<<< HEAD
// app.use('/newaddTransaction', newaddAccountRouter);
=======
app.use('/closeAccount', closeAccountRouter);
>>>>>>> 7eb8459... Close Account,Card,Account

// catch 404 and forward to error handler

app.use(function (req, res, next) {
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
