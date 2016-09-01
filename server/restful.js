var chalk = require('chalk');
var config = require('./config');
var crud = require('./crud');

module.exports = new Promise(restify_models);

function restify_models(resolve, reject) {
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


