
////////////////////////////////////////////////////////////////
/// models, schema

var config = require('./config');
var chalk = require('chalk');
var mongoose = require('mongoose');
var q = require('q');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

mongoose.Promise = require('q').Promise;

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
  major: { type: String , required: true },
  description: { type: String, required: true },
  price: Number,
  name : { type: String },
  school : { type: String, required : false },
  // school: { ref: 'School', type: ObjectId, required : false },
  postedByUserId: { ref: 'User', type: ObjectId, required : false }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

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
  postId: { ref: 'Post', type: Number },
  userId: { ref: 'User', type: Number }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var userSequence = require('mongoose-sequence');
var postSequence = require('mongoose-sequence');
var schoolSequence = require('mongoose-sequence');
var bookingSequence = require('mongoose-sequence');
var commentSequence = require('mongoose-sequence');

UserSchema.plugin(userSequence, { 'inc_field': 'userId' });
PostSchema.plugin(postSequence, { 'inc_field': 'postId' });
SchoolSchema.plugin(schoolSequence, { 'inc_field': 'schoolId' });
BookingSchema.plugin(bookingSequence, { 'inc_field': 'bookingId' });
CommentSchema.plugin(commentSequence, { 'inc_field': 'commentId' });

var UserModel = mongoose.model('User', UserSchema);
var PostModel = mongoose.model('Post', PostSchema);
var SchoolModel = mongoose.model('School', SchoolSchema);
var BookingModel = mongoose.model('Booking', BookingSchema);
var CommentModel = mongoose.model('Comment', CommentSchema);

////////////////////////////////////////////////////////////////
/// crud 

function crudify_models(resolve, reject) {
  var db = mongoose.connect(config.mongoose.url /* --mlab (cloud), --localhost(data/db) */);
  db.then(function () {
    var address = JSON.stringify(config.mongoose.url);
    address = address.slice(1, address.length - 1);
    console.log(chalk.green('OK'), 'mongoose server', chalk.blue(address));
    
    var models = {
      User : UserModel,
      Post : PostModel,
      School : SchoolModel,
      Booking : BookingModel,
      Comment : CommentModel
    };
    
    resolve(models);
  });
}

////////////////////////////////////////////////////////////////
/// restful

function restify_cruds(resolve, reject) {
  var crud = new Promise(crudify_models);
  crud.then(function(models) {
    var express = require('express');
    var router = express.Router();
    
    router.addRestfulApiPerCrudModel = addRestfulApiPerCrudModel;
    
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

  this
  .route(resource_all_items)
  .get(get_all_items(collection, model))
  .post(post_new_item(collection, model));

  this
  .route(resource_one_item)
  .get(get_one_item(resource_one_item, collectionIndex, model))
  .put(update_one_item(resource_one_item, collectionIndex, model))
  .delete(delete_one_item(resource_one_item, collectionIndex, model));

  return this;
}

function post_new_item(collection, model) {
  return insert_new_item;
  
  function insert_new_item(req, res) {
    console.log(chalk.magenta('post'), collection, req.body);
    var user = new model(req.body);
    user.save(function(err) {
      if (err) {
        res.status(404).end('cannot save');
      } else {
        res.status(200).json(user);
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
/// exports

module.exports = {
  User: UserModel,
  Post: PostModel,
  School: SchoolModel,
  Comment: CommentModel,
  Booking: BookingModel,
  crud : crudify_models /* Promise */,
  restful : restify_cruds /* Promise */
};
