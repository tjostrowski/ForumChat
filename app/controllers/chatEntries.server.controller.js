'use strict';

var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  ChatEntry = mongoose.model('ChatEntry');

exports.create = function(req, res) {
  var chatEntry = new ChatEntry(req.body);
  if (req.query.user) {
    chatEntry.user = JSON.parse(req.query.user)._id;
  }
  chatEntry
    .save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(chatEntry);
      }
    });
};

exports.delete = function(req, res) {
  var chatEntry = req.chatEntry;
  chatEntry.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(chatEntry);
    }
  });
};

exports.chatEntryByID = function(req, res, next, id) {
  ChatEntry.findById(id).populate('user').exec(function(err, entry) {
    if (err) return next(err);
    if (!entry) return next(new Error('Entry is not accessible: ' + id));
    req.chatEntry = entry;
    next();
  });
};

exports.list = function(req, res) {
  ChatEntry.find().sort('-created').populate('user').exec(
    function(err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(users);
      }
    });
};
