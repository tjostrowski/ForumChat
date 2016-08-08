'use strict';

var mongoose = require('mongoose'),
  should = require('should'),
  ChatEntry = mongoose.model('ChatEntry'),
  ChatUser = mongoose.model('ChatUser');

var chatUser, chatAdmin, chatUserAndAdmin, chatEntries = [];

describe('Chat Unit Tests', function() {
  beforeEach(function(done) {
    chatEntries = [];

    chatUser = new ChatUser({
      nick: 'ChatUser',
      roles: ['user']
    });

    chatAdmin = new ChatUser({
      nick: 'ChatAdmin',
      roles: ['admin']
    });

    chatUserAndAdmin = new ChatUser({
      nick: 'ChatFullAdmin',
      roles: ['user', 'admin']
    });

    chatUser.save(function() {
      chatEntries.push(new ChatEntry({
        created: Date.now(),
        value: 'This simple chat user entry test',
        user: chatUser
      }));
    });

    chatAdmin.save(function() {
      chatEntries.push(new ChatEntry({
        value: 'This simple chat admin entry test',
        user: chatAdmin
      }));
    });

    chatUserAndAdmin.save(function() {
      chatEntries.unshift(new ChatEntry({
        value: 'This simple chat user and admin entry insert test',
        user: chatUserAndAdmin
      }));
    });

    done();
  });

  describe('Method save', function() {
    it('should be saved without problems', function (done) {
      var firstChatEntry = chatEntries[0];
      firstChatEntry.save(function (err) {
        should.not.exist(err);
        // done();
      });

      var secondChatEntry = chatEntries[1];
      secondChatEntry.save(function (err) {
        should.not.exist(err);
        // done();
      });

      var thirdChatEntry = chatEntries[2];
      thirdChatEntry.save(function (err) {
        should.not.exist(err);
        // done();
      });

      done();
    });

    it('should require value', function (done) {
      var firstChatEntry = chatEntries[0];
      firstChatEntry.value = '';
      firstChatEntry.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    ChatUser.remove().exec();
    ChatEntry.remove().exec();
    done();
  });
});
