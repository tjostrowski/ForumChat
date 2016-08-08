'use strict';

angular.module('core').factory('ChatEntries', ['$resource',
  function($resource) {
    return $resource('chatEntries/:chatEntryId', {
      chatEntryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
