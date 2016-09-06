var mongoose = require("mongoose");
var chai = require('chai');
var expect = chai.expect;

describe("mongoose model", function() {

  var User = undefined;
  var Post = undefined;
  var Comment = undefined;
  var School = undefined;
  var Booking = undefined;

  before(function(done) {
    var config = require('../server/config');
    var models = require('../server/models');
    
    User = models.User;
    Post = models.Post;
    School =  models.School;
    Comment = models.Comment;
    Booking = models.Booking;

    if (!mongoose.connection.db) {
      done();
    } else {
      mongoose.disconnect(function() {
        done();
      });
    }
  });

  after(function(done){
    done();
  });

  beforeEach(function(done) {
    done();
  });

  afterEach(function(done) {
    done();
  });

  it("should define models (User, Post, School, Booking, Comment)", function(done) {

    expect(User).to.exist;
    expect(Post).to.exist;
    expect(School).to.exist;
    expect(Booking).to.exist;
    expect(Comment).to.exist;

    expect(User).to.be.a('function');
    expect(Post).to.be.a('function');
    expect(School).to.be.a('function');
    expect(Booking).to.be.a('function');
    expect(Comment).to.be.a('function');

    var u1 = new User();
    var p1 = new Post();
    var s1 = new School();
    var b1 = new Booking();
    var c1 = new Comment();
    
    expect(u1).to.be.a('object');
    expect(p1).to.be.a('object');
    expect(s1).to.be.a('object');
    expect(b1).to.be.a('object');
    expect(c1).to.be.a('object');

    var u1_j = u1.toJSON(); delete u1_j['_id'];
    var p1_j = p1.toJSON(); delete p1_j['_id'];
    var s1_j = s1.toJSON(); delete s1_j['_id'];
    var b1_j = b1.toJSON(); delete b1_j['_id'];
    var c1_j = c1.toJSON(); delete c1_j['_id'];

    expect(u1_j).to.be.eql({ comments: [], schools: [] });
    expect(p1_j).to.be.eql({ });
    expect(s1_j).to.be.eql({ });
    expect(b1_j).to.be.eql({ });
    expect(c1_j).to.be.eql({ });

    done();
  });

  it("should not validate new user, because of missing required field", function(done) {
    var u1 = new User()
    expect(u1.toJSON()).to.contain.keys("_id");
    u1.validate(function(err) {
      expect(err.errors.username).to.exist;
      expect(err.errors.password).to.exist;
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      done();
    });
  });

  it("should not validate new user, having some required field", function(done) {
    var data = {username :"hello", password:"passme", firstName:"alpha", lastName:"Omega"};
    var u1 = new User(data);
    expect(u1.toJSON()).to.contain.keys("_id");
    expect(u1.toJSON()).to.contains.keys(data);
    u1.validate(function(err) {
      expect(err.errors.username).to.not.exist;
      expect(err.errors.password).to.not.exist;
      expect(err.errors.firstName).to.not.exist;
      expect(err.errors.lastName).to.not.exist;
      expect(err.errors.email).to.exist;
      done();
    });
  });

  it("should validate new user, having all required field", function(done) {
    var data = {username :"hello", password:"passme", firstName:"alpha", lastName:"Omega",
                email : "getme@somewhere.net"};
    var u1 = new User(data);
    expect(u1.toJSON()).to.contain.keys("_id");
    expect(u1.toJSON()).to.contain.keys(data);
    u1.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });

  });

  it("should not validate new post, missing required field", function(done) {
    var p1 = new Post();
    expect(p1.toJSON()).to.contain.keys("_id");
    p1.validate(function(err) {
      expect(err.errors.title).to.exist;
      expect(err.errors.major).to.exist;
      expect(err.errors.description).to.exist;
      done();
    });
  });

  it("should not validate new post, having some required field", function(done) {
    var data = {title: "chemistry tour", major: "chemistry"};
    var p1 = new Post(data);
    expect(p1.toJSON()).to.contain.keys("_id");
    expect(p1.toJSON()).to.contain.keys(data);
    p1.validate(function(err) {
      expect(err.errors.title).to.not.exist;
      expect(err.errors.major).to.not.exist;
      expect(err.errors.description).to.exist;
      done();
    });
  });

  it("should validate new post, having all required field", function(done) {
    var data = {title: "chemistry tour", major: "chemistry", description : "la la la"};
    var p1 = new Post(data);
    expect(p1.toJSON()).to.contain.keys("_id");
    expect(p1.toJSON()).to.contain.keys(data);
    p1.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });

  it("should not validate new comment, missing required field", function(done) {
    var data = {};
    var c1 = new Comment(data);
    expect(c1.toJSON()).to.contain.keys("_id");
    c1.validate(function(err) {
      expect(err.errors.comment).to.exist;
      done();
    });
  });

  it("should not validate new comment, having required field", function(done) {
    var data = {comment : "hello"};
    var c1 = new Comment(data);
    expect(c1.toJSON()).to.contain.keys("_id");
    c1.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });

  it("should not validate new booking, missing required field", function(done) {
    var b1 = new Booking();
    expect(b1.toJSON()).to.contain.keys("_id");
    b1.validate(function(err) {
      expect(err).to.exist;
      // expect(err.error.place).to.exist;
      expect(err.error).to.not.exist;
      done();
    });
  });

  it("should not validate booking, having required field", function(done) {
    var data = {"place" : "here"};
    var b1 = new Booking(data);
    expect(b1.toJSON()).to.contain.keys("_id");
    b1.validate(function(err) {
      expect(err).to.exist;
      expect(err.error).to.not.exist;
      // expect(err.error.time).to.exist;
      // expect(err.error.place).to.not.exist;
      done();
    });
  });

});

describe("mongoose model, instance/method functions", function() {
  var User = undefined;
  var Post = undefined;
  var Comment = undefined;
  var School = undefined;
  var Booking = undefined;

  before(function() {
    var config = require('../server/config');
    var models = require('../server/models');
    
    User = models.User;
    Post = models.Post;
    School =  models.School;
    Comment = models.Comment;
    Booking = models.Booking;
  });

  xit("TBD", function(done) {
    done();
  });

});

describe("mongoose model, class/static functions", function() {
  var User = undefined;
  var Post = undefined;
  var Comment = undefined;
  var School = undefined;
  var Booking = undefined;

  before(function() {
    var config = require('../server/config');
    var models = require('../server/models');
    
    User = models.User;
    Post = models.Post;
    School =  models.School;
    Comment = models.Comment;
    Booking = models.Booking;
  });

  xit("TBD", function(done) {
    done();
  });
 
});

