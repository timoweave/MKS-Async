var config = require('./config');

//////////////////////////////////////////////////////
/*
 * 1. mongoose connection to mongo
 * 2. mongoose schemas, models
 * 3. express restful api to mogoose
 * 4. export models and routers
 */

//////////////////////////////////////////////////////
/*
 * 1. mongoose connection to mongo
 */

var mongoose = require('mongoose');
var chalk = require('chalk');

var db = mongoose.connect(config.mongoose.url /* --mlab (cloud), --localhost(data/db) */);

db.connection.on('error', function() {
  var address = JSON.stringify(config.mongoose.url);
  address = address.slice(1, address.length - 1);
  console.log(chalk.red('NO'), 'mongoose server', chalk.bgRed(address));
});
db.connection.once('open', function() {
  var address = JSON.stringify(config.mongoose.url);
  address = address.slice(1, address.length - 1);
  console.log(chalk.green('OK'), 'mongoose server', chalk.blue(address));
  // schema, models, and router should be here
});

//////////////////////////////////////////////////////
/*
 * 2. schemas, models
 */

var UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  schools: [ { ref: 'School', type : mongoose.Schema.Types.ObjectId } ],
  comments: [ { ref: 'Comment', type: mongoose.Schema.Types.ObjectId } ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var PostSchema = mongoose.Schema({
  title: { type: String, required: true },
  major: { type: String, required: true },
  price: Number,
  description: { type: String, required: true },
  school: { ref: 'School', type: mongoose.Schema.Types.ObjectId },
  postedByUserId: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var SchoolSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true},
  state: { type : String, required: true }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var CommentSchema = mongoose.Schema({
  comment: { type: String, required: true },
  postId: { ref: 'Post', type: mongoose.Schema.Types.ObjectId },
  userId: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var BookingSchema = mongoose.Schema({
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

var UserSequence = require('mongoose-sequence');
var PostSequence = require('mongoose-sequence');
var SchoolSequence = require('mongoose-sequence');
var BookingSequence = require('mongoose-sequence');
var CommentSequence = require('mongoose-sequence');

UserSchema.plugin(UserSequence, {
  'inc_field': 'userId'
});
PostSchema.plugin(PostSequence, {
  'inc_field': 'postId'
});
SchoolSchema.plugin(PostSequence, {
  'inc_field': 'schoolId'
});
BookingSchema.plugin(UserSequence, {
  'inc_field': 'bookingId'
});
CommentSchema.plugin(PostSequence, {
  'inc_field': 'commentId'
});

var UserModel = mongoose.model('User', UserSchema);
var PostModel = mongoose.model('Post', PostSchema);
var SchoolModel = mongoose.model('School', SchoolSchema);
var BookingModel = mongoose.model('Booking', BookingSchema);
var CommentModel = mongoose.model('Comment', CommentSchema);

//////////////////////////////////////////////////////
/*
 * 3. routers
 */

var express = require('express');
var router = express.Router();

addRouter(router, UserModel, '/users', 'userId');
addRouter(router, PostModel, '/posts', 'postId');
addRouter(router, SchoolModel, '/schools', 'schoolId');
addRouter(router, CommentModel, '/comments', 'commentId');
addRouter(router, BookingModel, '/bookings', 'bookingId');

function addRouter(router, model, collection, indexing) {

  router
  .route(collection)
  .get(function(req, res) {
    console.log(chalk.magenta('get'), collection);
    model.find({}, function(err, users) {
      if (err) {
        res.status(404).end('cannot find');
      } else {
        res.status(200).json(users);
      }
    });
  })
  .post(function(req, res) {
    console.log(chalk.magenta('post'), collection, req.body);
    var user = new model(req.body);
    user.save(function(err) {
      if (err) {
        res.status(404).end('cannot save');
      } else {
        res.status(200).json(user);
      }
    });
  });

  router.param(indexing, function(req, res, next, id) {
    req.params[indexing] = id;
    next();
  });

  var item = collection + '/:' + indexing; // + '(\\d+)';
  router
  .route(item)
  .get(function(req, res) {
    console.log(chalk.magenta('get'), item, req.params[indexing]);
    var filter = {};
    filter[indexing] = req.params[indexing];
    model.findOne(filter, function(err, data) {
      if (err) {
        res.status(404).end('cannot find the specify ' + indexing);
      } else {
        res.status(200).json(data);
      }
    });
  })
  .put(function(req, res) {
    console.log(chalk.magenta('post'), item, req.params[indexing]);
    var filter = {};
    filter[indexing] = req.params[indexing];
    model.findOne(filter, function(err_find, data) {
      if (err_find) {
        res.status(404).end('update fail: find fail, ' + indexing);
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

  })
  .delete(function(req, res) {
    console.log(chalk.magenta('delete'), item, req.params[indexing]);
    var filter = {};
    filter[indexing] = req.params[indexing];
    model.findOne(filter, function(err_find, data) {
      if (err_find) {
        res.status(404).end('delete fail: find fail, ' + indexing);
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
  });

  return router;
}

//////////////////////////////////////////////////////
/*
 * 4. exports
 */

module.exports = {
  User: UserModel,
  Post: PostModel,
  School: SchoolModel,
  Comment: CommentModel,
  Booking: BookingModel,
  Router: router
};
