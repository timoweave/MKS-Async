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
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  comments: [ { ref: 'Comment', type: mongoose.Schema.Types.ObjectId } ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var PostSchema = mongoose.Schema({
  title: String,
  name: String,
  school: String,
  major: String,
  price: Number,
  description: String,
  postedByUserId: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var CommentSchema = mongoose.Schema({
  comment: String,
  postId: { ref: 'Post', type: mongoose.Schema.Types.ObjectId },
  userId: { ref: 'User', type: mongoose.Schema.Types.ObjectId }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var BookingSchema = mongoose.Schema({
  postId: { ref : "Post", type : Number },
  userId: { ref : "User", type : Number }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var UserSequence = require('mongoose-sequence');
var PostSequence = require('mongoose-sequence');
var BookingSequence = require('mongoose-sequence');
var CommentSequence = require('mongoose-sequence');

UserSchema.plugin(UserSequence, {
  'inc_field': 'userId'
});
PostSchema.plugin(PostSequence, {
  'inc_field': 'postId'
});
BookingSchema.plugin(UserSequence, {
  'inc_field': 'bookingId'
});
CommentSchema.plugin(PostSequence, {
  'inc_field': 'commentId'
});

var UserModel = mongoose.model('User', UserSchema);
var PostModel = mongoose.model('Post', PostSchema);
var BookingModel = mongoose.model('Booking', BookingSchema);
var CommentModel = mongoose.model('Comment', CommentSchema);

//////////////////////////////////////////////////////
/*
 * 3. routers
 */

var express = require('express');
var router = express.Router();

router
  .route('/users')
  .get(function(req, res) {
    console.log('get /users');
    UserModel.find({}, function(err, users) {
      res.status(200).json(users);
    });
  })
  .post(function(req, res) {
    console.log('post /users', req.body);
    var user = new UserModel(req.body);
    user.save(function(err) {
      if (err) {
        res.status(404).end('cannot save');
      } else {
        res.status(200).json(user);
      }
    });
  });

router
  .route('/users/:id')
  .get(function(req, res) {
    console.log('get /users/:id', req.params.id);
    UserModel.find({
      userId: req.params.id
    }, function(err, users) {
      res.status(200).json(users);
    });
  });

router
  .route('/posts')
  .get(function(req, res) {
    PostModel.find(function(err, posts) {
      res.status(200).json(posts);
    });
  })
  .post(function(req, res) {
    console.log('post /posts', req.body);
    var post = new PostModel(req.body);
    post.save(function() {
      res.status(200).json(post);
    });
  });

router
  .route('/posts/:id')
  .get(function(req, res) {
    console.log('get /post/:id', req.params.id);
    UserModel.find({
      postId: req.params.id
    }, function(err, posts) {
      res.status(200).json(posts);
    });
  });

router
  .route('/bookings')
  .get(function(req, res) {
    console.log('get /bookings');
    BookingModel.find(function(err, body) {
      res.status(200).json(body);
    });
  })
  .post(function(req, res) {
    console.log('post /bookings', req.body);
    var booking = new BookingModel(req.body);
    booking.save(function() {
      res.status(200).json(booking);
    });
  });

router
  .route('/bookings/:id')
  .get(function(req, res) {
    console.log('get /bookings/:id', req.params.id);
    BookingModel.find({
      bookingId: req.params.id
    }, function(err, posts) {
      res.status(200).json(posts);
    });
  });

router
  .route('/comments')
  .get(function(req, res) {
    console.log('get /comments');
    CommentModel.find(function(err, body) {
      res.status(200).json(body);
    });
  })
  .post(function(req, res) {
    console.log('post /comments', req.body);
    var booking = new CommentModel(req.body);
    booking.save(function() {
      res.status(200).json(booking);
    });
  });

router
  .route('/comments/:id')
  .get(function(req, res) {
    console.log('get /comments/:id', req.params.id);
    CommentModel.find({
      bookingId: req.params.id
    }, function(err, posts) {
      res.status(200).json(posts);
    });
  });

//////////////////////////////////////////////////////
/*
 * 4. exports
 */

module.exports = {
  User: UserModel,
  Post: PostModel,
  Comment: CommentModel,
  Booking: BookingModel,
  Router: router
};
