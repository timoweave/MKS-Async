var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var models = require('./models');
var chalk = require('chalk');
var app = express();

// app.set('views', __dirname + '/views');
// app.set('view engine', 'html');
app.set('port', (process.env.PORT) || 3000);
app.use(morgan('combined'));

<<<<<<< 6c06e2d921d19844c6210acc4de02facbfd36833
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname,'../bower_components')));
=======

>>>>>>> Grunt near completion, committing in order to rebase

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', models.Router);

app.get('/', function(req, res) {
  // var something = req.body.something;
  //do something with 'something'
<<<<<<< 6c06e2d921d19844c6210acc4de02facbfd36833
  res.sendFile(path.join(__dirname, '../public/index.html'));
=======

>>>>>>> Grunt near completion, committing in order to rebase
});

app.post('/', function(req, res) {

  var something = req.body.something;
  //do something with 'something'

});

var server = app.listen(app.get('port'), function() {
  console.log(chalk.green('OK'), 'server', server.address().port);
<<<<<<< 6c06e2d921d19844c6210acc4de02facbfd36833
=======
>>>>>>> Grunt near completion, committing in order to rebase
});

