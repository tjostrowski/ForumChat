'use strict';

var should = require('should'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  app = require('../../server'),
  agent = request.agent(app),
  ChatUser = mongoose.model('ChatUser'),
  ChatEntry = mongoose.model('ChatEntry');

var chatUser, chatAdmin, chatEntries = [];

describe('Chat CRUD tests', function() {
  beforeEach(function(done) {
    // Create a new chat user
    chatUser = new ChatUser({
      nick: 'SimpleChatUser',
      roles: ['user']
    });

    chatAdmin = new ChatUser({
      nick: 'ChatAdmin',
      roles: ['admin']
    });

    chatAdmin.save(function() {
      chatEntries.push(new ChatEntry({
        value: 'Test chat entry',
        user: chatAdmin
      }));

      // done();
    });

    done();

    // // Save a user to the test db and create new article
    // user.save(function() {
    //   article = {
    //     title: 'Article Title',
    //     content: 'Article Content'
    //   };

  });

  it('should be able to save and delete chat user', function(done) {
    agent.post('/chatUsers')
      .send(chatUser)
      .expect(200)
      .end(function(saveErr, saveRes) {
        if (saveErr) done(saveErr);

        console.log('** id:' + saveRes.body._id);

        agent.delete('/chatUsers/' + saveRes.body._id)
          .send(chatUser)
          .expect(200)
          .end(function(deleteErr, deleteRes) {
            done(deleteErr);
          });
      });
  });

  it('should be possible to list all chat users', function(done) {
    agent.get('/chatUsers')
      .expect(200)
      .end(function(getErr, getRes) {
        done(getErr);
      });
  });

  it('should be possible to update chat user', function(done) {
    agent.post('/chatUsers')
      .send(chatUser)
      .expect(200)
      .end(function(saveErr, saveRes) {
        if (saveErr) done(saveErr);

        console.log('** id:' + saveRes.body._id);

        chatUser.nick = 'UpdatedChatUser';

        agent.put('/chatUsers/' + saveRes.body._id)
          .send(chatUser)
          .expect(200)
          .end(function(updateErr, updateRes) {
            if (updateErr) done(updateErr);

            (updateRes.body.nick).should.equal('UpdatedChatUser');
          });
      });
  });

  it('should be possible to add new chat entry', function(done) {
    var firstChatEntry = chatEntries[0];
    agent.post('/chatEntries')
      .send(firstChatEntry)
      .expect(200)
      .end(function(addErr, addRes) {
        done(addErr);
      });
  });
});
