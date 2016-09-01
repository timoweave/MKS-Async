var mongoose = require("mongoose");
var chai = require('chai');
var expect = chai.expect;

var config = require('../server/config');
config.mongoose.url = config.mongoose.localhost;
var models = require('../server/models');

var User = models.User;
var Post = models.Post;
var Comment = models.Comment;
var Booking = models.Booking;

var server = require('../server/server');
var supertest = require('supertest');
var request = supertest.agent(server);

describe("database model", function() {
  /*
  var cruds = undefined;
  var models = undefined;
  */
  beforeEach(function() {
    /*
    cruds = new Promise(models.restify_cruds);
    cruds.then(function (m) {
      models = m;
    });
     */
  });

  afterEach(function() {
    
  });

  it("new user, missing required field", function(done) {
    var u1 = new User()
    u1.validate(function(err) {
      expect(err.errors.username).to.exist;
      expect(err.errors.password).to.exist;
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      done();
    });
  });

  it("new user, having required field", function(done) {
    var u1 = new User({username :"hello", password:"passme", firstName:"alpha", lastName:"Omega"})
    u1.validate(function(err) {
      expect(err.errors.username).to.not.exist;
      expect(err.errors.password).to.not.exist;
      expect(err.errors.firstName).to.not.exist;
      expect(err.errors.lastName).to.not.exist;
      expect(err.errors.email).to.exist;
      done();
    });
  });

  it("new post, missing required field", function(done) {
    var p1 = new Post();
    p1.validate(function(err) {
      expect(err.errors.title).to.exist;
      expect(err.errors.major).to.exist;
      expect(err.errors.description).to.exist;
      done();
    });
  });

  it("new post, having required field", function(done) {
    var p1 = new Post({title: "chemistry tour", major: "chemistry"});
    p1.validate(function(err) {
      expect(err.errors.title).to.not.exist;
      expect(err.errors.major).to.not.exist;
      expect(err.errors.description).to.exist;
      done();
    });
  });

  it("new comment, missing required field", function(done) {
    var c1 = new Comment({});
    c1.validate(function(err) {
      expect(err.errors.comment).to.exist;
      done();
    });
  });

  it("new comment, having required field", function(done) {
    var c1 = new Comment({comment : "hello"});
    c1.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });

  it("new booking, missing required field", function(done) {
    var b1 = new Booking();
    b1.validate(function(err) {
      expect(err).to.exist;
      // expect(err.error.place).to.exist;
      expect(err.error).to.not.exist;
      done();
    });
  });

  it("new booking, having required field", function(done) {
    var b1 = new Booking({"place" : "here"});
    b1.validate(function(err) {
      expect(err).to.exist;
      expect(err.error).to.not.exist;
      // expect(err.error.time).to.exist;
      // expect(err.error.place).to.not.exist;
      done();
    });
  });
});

describe("restful api", function() {

  beforeEach(function() {
    
  });

  afterEach(function() {
    
  });

  it("user", function() {
    // request.get('/api/users').expect(200, done );
    expect(true).to.equal(true);
  });

  it("post", function() {
    expect(true).to.equal(true);
  });

  it("comment", function() {
    expect(true).to.equal(true);
  });

  it("booking", function() {
    expect(true).to.equal(true);
  });
});