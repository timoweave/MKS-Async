var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var config = require('./config');
var models = require('./models');
var chalk = require('chalk');
var app = express();

// app.set('views', __dirname + '/views');
// app.set('view engine', 'html');
// app.set('host', config.server.host);
app.set('port', config.server.port);
app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname,'../bower_components')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', models.Router);

app.get('/', function(req, res) {
  // var something = req.body.something;
  //do something with 'something'
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/', function(req, res) {

  var something = req.body.something;
  //do something with 'something'

});

var server = app.listen(app.get('port'), serve_up);

function serve_up() {
  var address = server.address().address;
  if (server.address().address === '::') {
    address = 'localhost';
  }
  address += ':' + server.address().port;
  console.log(chalk.green('OK'), 'node server', chalk.blue(address));
}
