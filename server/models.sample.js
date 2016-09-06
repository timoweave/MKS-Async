var path = require('path');
var request = require('request');
var jsonfile = require('jsonfile');
var config = require('./config');
var models = require('./models');

var used_as_top_module = !module.parent;
var url = config.mongoose.url;

if (used_as_top_module) {
  console.log(url);
}

saveSampleData(path.join(__dirname, 'models.sample.json'));

function addSampleData(url, filename, addMethod /* (url, doc, key) */) {
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

    connected_models.User.remove({}, clear_user_message);
    connected_models.Post.remove({}, clear_post_message);
    connected_models.School.remove({}, clear_school_message);
    connected_models.Booking.remove({}, clear_booking_message);
    connected_models.Comment.remove({}, clear_comment_message);

    addSampleData(url, filename, insert_sample_data);

    function insert_sample_data(url, doc, modelName) {
      
      delete doc.id;
      var modelLabel = modelName[0].toUpperCase() + modelName.slice(1, modelName.length-1);
      var modelClass = connected_models[modelLabel];

      var model = new modelClass(doc);
      model.save(function(err) {
        if (used_as_top_module) { 
          if (err) {
            console.log("err", modelLabel, err);
          } else {
            console.log("ok", modelLabel, model);
          }
        }
      });
    }
    function clear_user_message() { if (used_as_top_module) { console.log("clear User"); } }
    function clear_post_message() { if (used_as_top_module) { console.log("clear Post"); } }
    function clear_school_message() { if (used_as_top_module) { console.log("clear School"); } }
    function clear_booking_message() { if (used_as_top_module) { console.log("clear Booking"); } }
    function clear_comment_message() { if (used_as_top_module) { console.log("clear Comment"); } }
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

module.exports = {
  save_sample_data : saveSampleData
};