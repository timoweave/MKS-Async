var request = require('request');
var jsonfile = require('jsonfile');

var config = require('./config');
var url = config.mongoose.restfulApi();

insertSampleData(url, 'models.json');

function insertSampleData(url, filename) { 

  jsonfile.readFile(filename, function(err, obj) {
    Object.keys(obj).forEach(function(key) {
      obj[key].forEach(function(doc) {
        delete doc.id;
        var option = { 'method' : 'POST', 'uri' : url + '/' + key, 'json' : doc };
        request(option, function(error, response, body) {
          if (!error) {
            console.log("ok", body);
          }
        });
      });
    });
  });
}

