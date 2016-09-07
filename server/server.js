var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var config = require('./config');
var models = require('./models');
var chalk = require('chalk');
var firebase = require('firebase');
var multer = require('multer');
var fs = require('fs');

// var upload = multer({dest: 'uploads/'});

var app = express();
app = create_app(app);
module.exports = app;

var dataServer = new Promise(add_restful_models(app));

if (!module.parent) {
  dataServer.then(function(srv) {
    start_app(srv);
  });
}

function add_restful_models(app) {
  return insert_restful_models;

  function insert_restful_models(resolve, reject) {
    var restful = new Promise(models.restify_cruds);
    restful.then(function(restful_api) {
      app.use('/api', restful_api);
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
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
  app.use(bodyParser.json({limit: '10mb'}));
 
// var upload = multer({ dest: './uploads/' });
//  app.post('/upload', upload.single('file'), function(req,res,next){
//     console.log('Uploade Successful ', req.file, req.body);
// });
 
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.get('/providerDash', function(req, res){
    res.sendFile(path.join(__dirname, '../public/client/providerDash/providerDash.html'));
  }); //MUST CHANGE WHEN WE HAVE AUTHENTICATION

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
    console.log(chalk.green('OK'), chalk.yellow('listen'), 'node server', chalk.blue(address));
  }
}
