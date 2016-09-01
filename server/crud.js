var config = require('./config');
var mongoose = require('mongoose');
var chalk = require('chalk');

module.exports = new Promise(connect_mongo_server);

function connect_mongo_server(resolve, reject) {
  var db = mongoose.connect(config.mongoose.url /* --mlab (cloud), --localhost(data/db) */);
  db.then(function () {
    var address = JSON.stringify(config.mongoose.url);
    address = address.slice(1, address.length - 1);
    console.log(chalk.green('OK'), 'mongoose server', chalk.blue(address));
    
    var models = require('./models');
    resolve(models);
  });
}
