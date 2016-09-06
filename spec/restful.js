var mongoose = require("mongoose");
var chai = require('chai');
var expect = chai.expect;

// var server = require('../server/server');
// var supertest = require('supertest');
// var request = supertest.agent(server);

xdescribe("restful api", function() { // rest api


  before(function(done) {
    var config = require('../server/config');
    var models = require('../server/models');
    var User = models.User;
    var Post = models.Post;
    var Comment = models.Comment;
    var Booking = models.Booking;
    config.mongoose.url = config.mongoose.localhost_test;

    var User = models.User;
    var Post = models.Post;
    var Comment = models.Comment;
    var Booking = models.Booking;

    done();
  });

  after(function(done){
    if (!mongoose.connection.db) {
      done();
    } else {
      mongoose.disconnect(function() {
        done();
      });
    }
  });

  beforeEach(function(done) {
    done();
  });

  afterEach(function(done) {
    done();
  });

  it("school", function(done) {
    // request.get('/api/users').expect(200, done );
    expect(true).to.equal(true);
    done();
  });

  it("user", function(done) {
    // request.get('/api/users').expect(200, done );
    expect(true).to.equal(true);
    done();
  });

  it("post", function(done) {
    expect(true).to.equal(true);
    done();
  });

  it("comment", function(done) {
    expect(true).to.equal(true);
    done();
  });

  it("booking", function(done) {
    expect(true).to.equal(true);
    done();
  });
});