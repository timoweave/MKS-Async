
////////////////////////////////////////////////////////////////
/// models, schema
var firebase = require('firebase');
var fs = require('fs');
var config = require('./config');
var chalk = require('chalk');
var mongoose = require('mongoose');
var q = require('q');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var multer =  require('multer');
var uploadImage = multer({desc : "images/"}).single('image');

mongoose.Promise = require('q').Promise; // mongoose.mpromise // deprecateda

var ImageSchema = Schema({
  originalName: { type: String, required: false }, // client-original-name
  saveName: { type: String, required: false }, // server-saved-name
  firebaseName: { type: String, required : false }, //
  uploadImage: { type: String, required: false } // file content
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var UserSchema = Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  schools: [ { ref: 'School', type : ObjectId, required : false } ],
  comments: [ { ref: 'Comment', type: ObjectId, required : false } ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var PostSchema = Schema({
  title: { type: String , required: true },
  imgUrl: {type: String, required: false},
  major: { type: String , required: true },
  description: { type: String, required: true },
  price: Number,
  name : { type: String, required: true },
  school : { type: String, required : false },
  // school: { ref: 'School', type: ObjectId, required : false },
  latitude : { type: Number, required: false },
  longitude : { type: Number, required: false },
  address: { type: String, required: true },
  firebaseId : { type : String, required : false},
  postedByUser: { type: String, required: false },
  uploadImage : { type : String, required: false }
  // postedByUserId: { ref: 'User', type: ObjectId, required : false }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

/* 
 * http://mongoosejs.com/docs/guide.html#methods
 */

/*
Postschema.pre("save", function() {
  this.setUser();

});

PostSchema.setUser = function(username) {
  var user = Users.find({username : username}, function(find_err, new_user) {
               if (find_err) {
                 user = new User();// ....
               }
               
               this.postedByUser = user;
               
             });
}
*/

var SchoolSchema = Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type : String, required: true }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var CommentSchema = Schema({
  comment: { type: String, required: true },
  postId: { ref: 'Post', type: ObjectId, required : false },
  userId: { ref: 'User', type: ObjectId, required : false }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var BookingSchema = Schema({
  time: { type: Date, required: true },
  place: { type: String, required: true },
  postId: { ref: 'Post', type: Number, required : false },
  userId: { ref: 'User', type: Number, required : false }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var imageSequence = require('mongoose-sequence');
var userSequence = require('mongoose-sequence');
var postSequence = require('mongoose-sequence');
var schoolSequence = require('mongoose-sequence');
var bookingSequence = require('mongoose-sequence');
var commentSequence = require('mongoose-sequence');

ImageSchema.plugin(imageSequence, { 'inc_field': 'imageId' });
UserSchema.plugin(userSequence, { 'inc_field': 'userId' });
PostSchema.plugin(postSequence, { 'inc_field': 'postId' });
SchoolSchema.plugin(schoolSequence, { 'inc_field': 'schoolId' });
BookingSchema.plugin(bookingSequence, { 'inc_field': 'bookingId' });
CommentSchema.plugin(commentSequence, { 'inc_field': 'commentId' });

var mongoose_models = {
  Image : mongoose.model('Image', ImageSchema),
  User : mongoose.model('User', UserSchema),
  Post : mongoose.model('Post', PostSchema),
  School : mongoose.model('School', SchoolSchema),
  Booking : mongoose.model('Booking', BookingSchema),
  Comment : mongoose.model('Comment', CommentSchema)
};

////////////////////////////////////////////////////////////////
/// crud

function crudify_models(resolve /* (models) */, reject) {

  // if (mongoose.connection.db) { resolve(mongoose_models); return; }

  var mongoose_url = JSON.stringify(config.mongoose.url);
  mongoose_url = mongoose_url.slice(1, mongoose_url.length - 1);

  mongoose.connection.on('connected', connected);
  mongoose.connection.on('disconnected', disconnected);
  mongoose.connection.on('error', error);
  mongoose.connection.once('open', ready);
  var db = mongoose.connect(config.mongoose.url /* --mlab (cloud), --localhost(data/db), --localhost_test*/);

  function ready() {
    resolve(mongoose_models);
  }

  function connected() {
    console.log(chalk.green('OK'), chalk.yellow('connected'), 'mongoose server', chalk.blue(mongoose_url));
  }

  function disconnected() {
    console.log(chalk.green('OK'), chalk.yellow('disconnected'), 'mongoose server', chalk.blue(mongoose_url));
    reject('fail');
  }

  function error() {
    console.log(chalk.red('NO'), chalk.yellow('error'), 'mongoose server', chalk.blue(mongoose_url));
  }
}

////////////////////////////////////////////////////////////////
/// restful

function restify_cruds(resolve /* (router) */, reject) {
  var crud = new Promise(crudify_models);
  crud.then(function(models) {
    var express = require('express');
    var router = express.Router();

    router.addRestfulApiPerCrudModel = addRestfulApiPerCrudModel;

    router.addRestfulApiPerCrudModel('/images', 'imageId', models.Image);
    router.addRestfulApiPerCrudModel('/users', 'userId', models.User);
    router.addRestfulApiPerCrudModel('/posts', 'postId', models.Post);
    router.addRestfulApiPerCrudModel('/schools', 'schoolId', models.School);
    router.addRestfulApiPerCrudModel('/comments', 'commentId', models.Comment);
    router.addRestfulApiPerCrudModel('/bookings', 'bookingId', models.Booking);

    resolve(router);
  });
  return crud;
}

function addRestfulApiPerCrudModel(collection, collectionIndex, model) {

  var resource_all_items = collection;
  var resource_one_item = collection + '/:' + collectionIndex + '(\\d+)';

  this
  .param(collectionIndex, set_param_index(collectionIndex));

  // "http://localhost:3000/posts/:postId(\\d+)"  // get "1st" item from collection
  // "http://localhost:3000/posts" // get all the items from collection
  // "http://localhost:3000/posts/13434" // 404, not found
  // "http://localhost:3000/posts/abc" // 404, not found
  // request({method : GET, url : "http://localhost:3000/posts  "}, funxtion() ...)
  // request({method : POST, url : "http://localhost:3000/posts", 
  //          data : JSON.stringify({username : xyz})}, funxtion() {}

  this
  .route(resource_all_items) // "/posts/"
  .get(get_all_items(collection, model)) // "get all items"
  .post(uploadImage, post_new_item(collection, model)); // "add a new item"

 // request({method : GET, url : "http://localhost:3000/posts/1"}, funxtion(result)  {})
 // request({method : PUT, url : "http://localhost:3000/posts/1"}, funxtion(result)  {})
 // request({method : DELETE, url : "http://localhost:3000/posts/1"}, funxtion(result)  {})
  this
  .route(resource_one_item) // "/posts/#"
  .get(get_one_item(resource_one_item, collectionIndex, model))

  .put(update_one_item(resource_one_item, collectionIndex, model))

  .delete(delete_one_item(resource_one_item, collectionIndex, model));


  return this;
}

function post_new_item(collection, model) {
  return insert_new_item;

  function insert_new_item(req, res) {
    console.log(chalk.magenta('post'), collection, req.body);
    var item = new model(req.body);
    if (req.file) {
      var buf = req.file.buffer;
      console.log(chalk.magenta('post image'), req.file);
      item.uploadImage = req.file.originalname;
      item.firebaseName = item.id + '.'+ req.file.originalname.split('.').reverse()[0];
      req.body.uploadImage = req.file.originalname;
      // req.body.saveName = "f." + req.file.originalname;
      req.body.originalName = req.file.originalname;
      var fileContent = buf.toString('utf8');
      // TBD, redirect or something
    }
    item.save(function(err) {
      if (err) {
        res.status(404).end('cannot save');
      } else {
        res.status(200).json(item);
      }
    });
  }
}


function get_all_items(collection, model) {
  return retrieve_all_items;
  function retrieve_all_items(req, res) {
    console.log(chalk.magenta('get'), collection);
    model.find({}, function(err, users) {
      if (err) {
        res.status(404).end('cannot find');
      } else {
        res.status(200).json(users);
      }
    });
  }
}

function set_param_index(collectionIndex) {
  return parse_param_index;

  function parse_param_index(req, res, next, id) {
    req.params[collectionIndex] = id;
    next();
  }
}

function get_one_item(resource_one_item, collectionIndex, model) {
  return retrieve_one_item;

  function retrieve_one_item(req, res) {
    console.log(chalk.magenta('get'), resource_one_item, req.params[collectionIndex]);
    var filter = {};
    filter[collectionIndex] = req.params[collectionIndex];
    model.findOne(filter, function(err, data) {
      if (err) {
        res.status(404).end('cannot find the specify ' + collectionIndex);
      } else {
        res.status(200).json(data);
      }
    });
  }
}

function update_one_item(resource_one_item, collectionIndex, model) {
  return change_one_item;

  function change_one_item(req, res) {
    console.log(chalk.magenta('post'), resource_one_item, req.params[collectionIndex]);
    var filter = {};
    filter[collectionIndex] = req.params[collectionIndex];
    model.findOne(filter, function(err_find, data) {
      if (err_find) {
        res.status(404).end('update fail: find fail, ' + collectionIndex);
      } else {
        data.save(function(err_save) {
          if (err_save) {
            res.status(404).end('update fail: save fail');
          } else {
            res.status(200).json(data); // 302?
          }
        });
      }
    });
  }
}

function delete_one_item(resource_one_item, collectionIndex, model) {
  return remove_one_item;

  function remove_one_item(req, res) {
    console.log(chalk.magenta('delete'), resource_one_item, req.params[collectionIndex]);
    var filter = {};
    filter[collectionIndex] = req.params[collectionIndex];
    model.findOne(filter, function(err_find, data) {
      if (err_find) {
        res.status(404).end('delete fail: find fail, ' + collectionIndex);
      } else {
        data.remove(function(err_save) {
          if (err_save) {
            res.status(404).end('delete fail: remove fail');
          } else {
            res.status(200).json(data); // 302?
          }
        });
      }
    });
  }
}

////////////////////////////////////////////////////////////////
/// firebase

var firebaseConfig = {
  apiKey: "AIzaSyBf5hgcfKqgRMvx4DvFtSq78S73Uv0kZic",
  authDomain: "future-insight.firebaseapp.com",
  databaseURL: "https://future-insight.firebaseio.com",
  storageBucket: "future-insight.appspot.com"
};
firebase.initializeApp(firebaseConfig);

////////////////////////////////////////////////////////////////
/// exports

module.exports = {
  Image: mongoose_models.Image,
  User: mongoose_models.User,
  Post: mongoose_models.Post,
  School: mongoose_models.School,
  Comment: mongoose_models.Comment,
  Booking: mongoose_models.Booking,
  crudify_models : crudify_models /* Promise */,
  restify_cruds : restify_cruds /* Promise */
};
