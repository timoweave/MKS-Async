var mongoose = require("mongoose");
var chai = require('chai');
var expect = chai.expect;

describe("mongo database", function() { // crud api

  var User, Post, Comment, Booking, School, Nothing;

  before(function(done) {
    var config = require('../server/config');
    var models = require('../server/models');
    config.mongoose.url = config.mongoose.localhost_test;

    var crud = new Promise(models.crudify_models);
    crud.then(function(connected_models) {

      User = connected_models.User;
      Post = connected_models.Post;
      Comment = connected_models.Comment;
      Booking = connected_models.Booking;
      School = connected_models.School;

      done();
    });
  });

  after(function(done) {
    let collections = [User, Post, Comment, Booking, School];
    empty_collections(collections, function() {
      mongoose.disconnect(function() {
        done();
      });
    });
  });

  beforeEach(function(done){
    let collections = [User, Post, Comment, Booking, School];
    empty_collections(collections, function() {
      done();
    });
  });

  afterEach(function(done){
    done();
  });
  
  it("should get defined models", function(done) {
    expect(Nothing).to.not.exist;
    expect(User).to.exist;
    expect(Post).to.exist;
    expect(School).to.exist;
    expect(Booking).to.exist;
    expect(Comment).to.exist;
    done();
  });

  it("should have an empty collections", function(done) {
    var blank_data = [];

    blank_data.push(new Promise(empty(User)));
    blank_data.push(new Promise(empty(School)));
    blank_data.push(new Promise(empty(Post)));
    blank_data.push(new Promise(empty(Booking)));
    blank_data.push(new Promise(empty(Comment)));

    Promise.all(blank_data).then(promise_finished(done));

    function empty(model) {
      return empty_detail;
      function empty_detail(res, rej) {
        model.find({}, function(error, models) {
          if (error) {
            expect(models).to.be.not.exist;
          } else {
            expect(models).to.be.exist;
            expect(models.length).to.be.equal(0);
          }
          res();
        });
      }
    }
  });

  it("should create user, school, post, booking, comment", function(done) {

    var add_list = [];
    add_list.push(new Promise(add_school));
    add_list.push(new Promise(add_user));
    add_list.push(new Promise(add_post));
    add_list.push(new Promise(add_booking));
    add_list.push(new Promise(add_comment));

    Promise.all(add_list).then(promise_finished(done));

    function add_user(resolve, reject) {
      var user = {username : "hellothere", firstName : "hello", lastName : "there",
                  email : "hthere@hello.io", password : "itisme"};
      add_model_first_data(User, "userId", user, resolve);
    }

    function add_post(resolve, reject) {
      var post = {title : "stanford library tour", major : "biology",
                  description : "how to reserve private room, find reference material, microfilm demo",
                  price : 50.50, name : "Peter Pans", school : "Stanford"};
      add_model_first_data(Post, "postId", post, resolve);
    }

    function add_booking(resolve, reject) {
      var booking = { time : "Fri Sep  2 20:35:04 PDT 2016", place : "palm drive" };
      add_model_first_data(Booking, "bookingId", booking, resolve);
    }

    function add_comment(resolve, reject) {
      var comment = {comment : "awesome tour, I love the campus"};
      add_model_first_data(Comment, "commentId", comment, resolve);
    }

    function add_school(resolve, reject) {
      var school = {name : "Stanford University", address : "palm drive",
                    city : "Stanford", state : "CA"};
      add_model_first_data(School, "schoolId", school, done);
    }

  });

  xit("should retrieve user, school, post, booking, comment", function(done) {
  });

  xit("should update user, school, post, booking, comment", function(done) {
  });

  xit("should delete user, school, post, booking, comment", function(done) {
  });

  // NOTE: afterwards, functions only
  
  function empty_collections(collections, done) { // helper
    var cleanup_models = [];

    for (let i = 0; i < collections.length; i++) {
      let collection = collections[i];
      let cleanup_model = new Promise(cleanup(collection));
      cleanup_models.push(cleanup_model);
    }

    Promise.all(cleanup_models).then(promise_finished(done));

    function cleanup(model) {
      return cleanup_model;
      function cleanup_model(resolve, reject) {
        model.remove({}, function() {
          resolve();
        });
      }
    }
  }

  function add_model_first_data(model, index, data, done) { // helper
    var m1 = new model(data);
    expect(m1.toJSON()).to.contain.keys("_id");
    m1.save(function() {
      expect(m1.toJSON()).to.contain.keys(index);
      expect(m1.toJSON()).to.contain.keys(data);
      model.find({}, function(err, models) {
        expect(models.length).to.be.equal(1);
        done();
      })
    });
  }

  function promise_finished(done) { // helper
    return function(values) {
      done();
    }
  }

});
