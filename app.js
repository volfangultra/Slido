var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var flash = require('express-flash');
var session = require('express-session');
var passport = require('passport');
const register = require('./funkcije/Register');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');
var teacherRouter = require('./routes/teacher');
var listenerRouter = require('./routes/listener');
var registerRouter = require('./routes/register');
var porukeRouter = require('./routes/poruke');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', './Layouts/login_layout');
const login = require("./funkcije/Login");
login.initialize(passport);


app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use(flash());
app.use(session({
  secret:"Hello za Wurdooo",
  resave:false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/teacher', teacherRouter);
app.use('/listener', listenerRouter);
app.use('/register', registerRouter);
app.use('/poruke', porukeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('Errors/error');
});

module.exports = app;
