'use strict';

var chatUsers = require('../../app/controllers/chatUsers.server.controller'),
  chatEntries = require('../../app/controllers/chatEntries.server.controller');

module.exports = function(app) {
  // ChatUser Routes
  app.route('/chatUsers')
    .get(chatUsers.list)
    .post(chatUsers.create);

  app.route('/chatUsers/:chatUserId')
    // .get(articles.read)
    .put(chatUsers.update)
    .delete(chatUsers.delete);
  //
  // // Finish by binding the article middleware
  app.param('chatUserId', chatUsers.chatUserByID);
  //
  // // ChatUser Routes
  app.route('/chatEntries')
    .get(chatEntries.list)
    .post(chatEntries.create);

  app.route('/chatEntries/:chatEntryId')
    // .get(chatEntries.read)
    // .put(users.requiresLogin, articles.hasAuthorization, articles.update)
    .delete(chatEntries.delete);

  // Finish by binding the article middleware
  app.param('chatEntryId', chatEntries.chatEntryByID);
};
