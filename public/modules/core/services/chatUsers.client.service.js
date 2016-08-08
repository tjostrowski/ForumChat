'use strict';

angular.module('core').factory('ChatUsers', ['$resource',
  function($resource) {
    return $resource('chatUsers/:chatUserId', {
      chatEntryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
