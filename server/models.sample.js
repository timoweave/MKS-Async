var request = require('request');
var jsonfile = require('jsonfile');

var objfile = 'models.json';

jsonfile.readFile(objfile, function(err, obj) {
  console.dir(obj);

  var users = obj.users;
  var posts = obj.posts;
  var comments = obj.comments;
  var bookings = obj.bookings;
  var url = '';

  request('', function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body);
    }
  });
});

