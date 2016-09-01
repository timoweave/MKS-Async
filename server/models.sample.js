var request = require('request');
var jsonfile = require('jsonfile');

var config = require('./config');
var models = require('./models');

var url = config.mongoose.url;
console.log(url);

saveSampleData('models.json');

function addSampleData(url, filename, addMethod) {
  jsonfile.readFile(filename, function(err, obj) {
    Object.keys(obj).forEach(function(key) {
      obj[key].forEach(function(doc) {
        addMethod(url, doc, key);
      });
    });
  });
}

function saveSampleData(filename) {

  var data = new Promise(models.crudify_models);

  data.then(function(connected_models) {

    connected_models.User.remove({}, function() { console.log("clear User"); });
    connected_models.Post.remove({}, function() { console.log("clear Post"); });
    connected_models.School.remove({}, function() { console.log("clear School"); });
    connected_models.Booking.remove({}, function() { console.log("clear Booking"); });
    connected_models.Comment.remove({}, function() { console.log("clear Comment"); });

    addSampleData(url, filename, function(url, doc, modelName) {
      delete doc.id;
      var modelName = modelName[0].toUpperCase() + modelName.slice(1, modelName.length-1);
      var modelClass = connected_models[modelName];

      var model = new modelClass(doc);
      model.save(function(err) {
        if (err) {
          console.log("err", modelName, err);
        } else {
          console.log("ok", modelName, model);
        }
      });
    });
  });
}

function postSampleData(url, filename) { 
  addSampleData(url, filename, function(url, doc, key) {
    delete doc.id;
    var option = { 'method' : 'POST', 'uri' : url + '/' + key, 'json' : doc };
    request(option, function(error, response, body) {
      if (!error) {
        console.log("ok", body);
      }
    });
  });
}

