var mongoose = require("mongoose");
var chai = require('chai');
var expect = chai.expect;

var config = require('../server/config');
config.mongoose.url = config.mongoose.mlab_test;
var models = require('../server/models');
var User = models.User;
var Post = models.Post;
var Comment = models.Comment;
var Booking = models.Booking;

describe("database model", function() {

  beforeEach(function() {
    
  });

  afterEach(function() {
    
  });

  it("user", function() {
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

describe("restful api", function() {

  beforeEach(function() {
    
  });

  afterEach(function() {
    
  });

  it("user", function() {
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