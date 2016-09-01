var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var config = require('./config');
var models = require('./models');
var chalk = require('chalk');

var app = express();
app = create_app(app);
module.exports = app;

var server = new Promise(add_restful_models(app));

if (!module.parent) {
  server.then(function(srv) {
    start_app(srv);
  });
}

function add_restful_models(app) {
  return insert_restful_models;

  function insert_restful_models(resolve, reject) {
    
    var restful = new Promise(models.restful);
    restful.then(function(api) {
      app.use('/api', api);
        resolve(app);
    });
    return restful;
  }
}

function create_app(app) {

  app.set('port', config.server.port);

  app.use(morgan('combined'));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.static(path.join(__dirname, '../bower_components')));
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
  
  return app;
}

function start_app(app) {
  var port = app.get('port');
  var server = app.listen(app.get('port'), wakeUp);
  return server;

  function wakeUp() {
    var address = server.address().address;
    if (server.address().address === '::') {
      address = 'localhost';
    }
    address += ':' + server.address().port;
    console.log(chalk.green('OK'), 'node server', chalk.blue(address));
  }
}