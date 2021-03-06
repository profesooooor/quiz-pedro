// app.js

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var partials = require('express-partials');   Esto lo he visto en el módulo 8 pero no me había hecho falta
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// Quitamos el parámetro { extended: false } para que se pasen bien las propiedades de quiz en _form.jade
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:true}));    // Ya no es correcto dejar la opción por defecto, hay que indicarla
app.use(cookieParser("quiz-pedro"));                // "quiz-pedro" es la semilla para filtrar cookie
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos (no sé qué significa 'helper')
app.use(function(req, res, next) {
    // Guardar path en session.redir para saber dónde volver tras hacer el login/logout
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }
    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

app.use('/', routes);

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
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
