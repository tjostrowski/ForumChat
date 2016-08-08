'use strict';

var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  ChatUser = mongoose.model('ChatUser'),
  _ = require('lodash');

exports.create = function(req, res) {
  var chatUser = new ChatUser(req.body);
  chatUser.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(chatUser);
    }
  });
};

exports.delete = function(req, res) {
  var chatUser = req.chatUser;
  chatUser.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(chatUser);
    }
  });
};

exports.chatUserByID = function(req, res, next, id) {
  ChatUser.findById(id).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('User is not accessible: ' + id));
    req.chatUser = user;
    next();
  });
};

exports.list = function(req, res) {
  console.log('**QUERY: ' + req.query);
  ChatUser.find(req.query || {}).sort('nick').exec(function(err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  });
};

exports.update = function(req, res) {
  var chatUser = req.chatUser;

  chatUser = _.extend(chatUser, req.body);

  chatUser.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(chatUser);
    }
  });
};
