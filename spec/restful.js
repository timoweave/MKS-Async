var mongoose = require("mongoose");
var chai = require('chai');
var expect = chai.expect;

var config = require('../server/config');
config.mongoose.url = config.mongoose.localhost_test;
var models = require('../server/models');

var User = models.User;
var Post = models.Post;
var Comment = models.Comment;
var Booking = models.Booking;

var server = require('../server/server');
var supertest = require('supertest');
var request = supertest.agent(server);

xdescribe("restful api", function() { // rest api

  beforeEach(function() {
    
  });

  afterEach(function() {
    
  });

  it("school", function() {
    // request.get('/api/users').expect(200, done );
    expect(true).to.equal(true);
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