var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var os = require('os');
const http = require('http')
var Busboy = require('busboy');

var session = require('express-session');
fn = require('./func.js');
db = require('./database/mongodb');
db_forums = require('./database/db_forums');
mail = require('./lib/mailgun');
//var Group = require('mongoose').model('group');
//var forums_cat = require('mongoose').model('forums_cat');

bzn.model('contact').find({}).populate('user_id').lean().exec(function(err,result){
   //console.log(result) ;
});



path_model = path.join(__dirname, 'model');
path_module = path.join(__dirname, 'module');




/*
var routes = require('./routes/index');
var users = require('./routes/users');
*/

var app = express();

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');//https://www.bazarn.com
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Accept, Origin, X-Session-ID');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Max-Age', '86400');

    next();
}
app.use(allowCrossDomain);

app.use(session({
	secret: 'keyboard cat' }
));

app.get('/', function(req, res, next) {
  res.render('index');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use('/uploadchat',express.static(__dirname + '/uploadchat'));
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));





app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
login = require(path_module+'/auth/permission');
require('./config_route')(app);

//require('./auth/facebook')(app,passport);

/*
app.use('/', routes);
app.use('/users', users);
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
