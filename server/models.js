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

var url = config.mongoose.local;
// var url = config.mongoose.mlab;
var db = mongoose.connect(url);
db.connection.on('error', function() {
  console.log(chalk.red('NO'), 'mongoose', JSON.stringify(url));
});
db.connection.once('open', function() {
  console.log(chalk.green('OK'), 'mongoose', JSON.stringify(url));
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
  comments: [Object] // to be define {}
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
  email: String,
  description: String,
  postedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchema'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var BookingSchema = mongoose.Schema({
  postId: Number,
  userId: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

var CommentSchema = mongoose.Schema({
  comment: String,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'PostSchema' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema' }
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
