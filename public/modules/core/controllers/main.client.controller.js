'use strict';

angular.module('core').controller('ChatController', ['$scope', 'ChatEntries',
  'ChatUsers',
  '$http',
  '_',
  function($scope, ChatEntries, ChatUsers, $http, _) {
    console.log('** Init ChatController');

    $scope.create = function() {
      var chatUser1, chatUser2;

      ChatUsers.query({
        nick: 'TestUser1'
      }, function(users) {
        if (users.length === 0) {
          var newUser1 = new ChatUsers({
            nick: 'TestUser1',
            roles: ['user']
          });
          newUser1.$save(function(response) {
            console.log('Saving newUser1 with success!');
          }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        }
      });

      ChatUsers.query({
        nick: 'TestUser2'
      }, function(users) {
        if (users.length === 0) {
          var newUser2 = new ChatUsers({
            nick: 'TestUser2',
            roles: ['user']
          });
          newUser2.$save(function(response) {
            console.log('Saving newUser2 with success!');
          }, function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        }

        var chatEntry = new ChatEntries({
          value: 'Test chat entry new ' + Date.now() +
            ' long suffix',
          // user: users[0]
        });
        chatEntry.$save({
            user: users[0]
          },
          function(response) {
            console.log('Saving chatEntry with success! ' + JSON.stringify(
              chatEntry.user));
          },
          function(errorResponse) {
            $scope.error = errorResponse.data.message;
          });
      });

      var rnd = Math.floor((Math.random() * 10) + 1);
      console.log('chatUser1: ' + chatUser1);

      // var chatEntry = new ChatEntries({
      //   value: 'Test chat entry new ' + Date.now() +
      //     ' long suffix',
      // });
      // ChatEntries.save(
      //   chatEntry, {
      //     user: ((rnd < 5) ? chatUser1 : chatUser2)
      //   },
      //   function(response) {
      //     console.log('Saving chatEntry with success!');
      //   },
      //   function(errorResponse) {
      //     $scope.error = errorResponse.data.message;
      //   });
    };

    $scope.find = function() {
      $scope.chatEntries = ChatEntries.query();
      console.log('** chatEntries: ' + $scope.chatEntries);
    };

    $scope.cite = function(chatEntryId, chatMessage) {
      console.log('Cite: ' + chatEntryId);
      var len = chatMessage.length,
        msgSize = 30;
      if (len > msgSize) {
        chatMessage = chatMessage.substring(0, msgSize) + ' ...';
      }

      var elem = angular.element(document.querySelector('#shout_message'));
      $scope.focusMessage = true;
      // $scope.$emit('ui:focus', '#shout_message');
      // elem.focus();
      elem.val('');
      elem.val(chatMessage + ' // ');
    };

    $scope.ignoreUser = function(userId, userNick) {
      console.log('Ignore user: ' + userNick);
      $scope.chatEntries = _.reject($scope.chatEntries, function(entry) {
        return entry.user && entry.user.nick === userNick;
      });
    };

    $scope.postShoutMessage = function() {
      console.log('postShoutMessage');
      if (!$scope.username || !$scope.message) {
        return;
      }

      ChatUsers.query({
        nick: $scope.username
      }, function(users) {
        if (users.length === 0) {
          var user = new ChatUsers({
            nick: $scope.username,
            roles: ['user']
          });
          user.$save(function(newUser) {
            saveChatEntry($scope.message, newUser);
          });
        } else {
          saveChatEntry($scope.message, users[0]);
        }
      });
    };

    $scope.getColor = function(nick) {
      if (nick === $scope.username) {
        var colorHex = ($scope.hexPickerColor) ? $scope.hexPickerColor :
          '#000000';
        return {
          'color': colorHex
        };
      }
      return {
        'color': '#000000'
      };
    };

    $scope.fireFilter = function() {
      console.log('fireFilter');

      if (!$scope.msgfilter) {
        $scope.find();
      }

      var msg = $scope.msgfilter,
        hasToday = msg.indexOf('@today') > -1,
        hasTome = msg.indexOf('@tome') > -1,
        hasUser = msg.indexOf('@user:') > -1,
        hasDate = msg.indexOf('@date:') > -1,
        hasText = msg.indexOf('@text:') > -1,
        userVal, dateVal, textVal, start, nextAtIdx;

      if (hasUser) {
        start = msg.indexOf('@user:') + '@user:'.length;
        nextAtIdx = msg.indexOf('@', start);
        userVal = msg.substring(start, Math.min(msg.length, (nextAtIdx ===
          -1) ? msg.length : nextAtIdx));
      }

      if (hasDate) {
        start = msg.indexOf('@date:') + '@date:'.length;
        nextAtIdx = msg.indexOf('@', start);
        dateVal = msg.substring(start, Math.min(msg.length, (nextAtIdx ===
          -1) ? msg.length : nextAtIdx));
      }

      if (hasText) {
        start = msg.indexOf('@text:') + '@text:'.length;
        nextAtIdx = msg.indexOf('@', start);
        textVal = msg.substring(start, Math.min(msg.length, (nextAtIdx ===
          -1) ? msg.length : nextAtIdx));
      }

      console.log('hasUser: ' + hasUser + ' hasText: ' + hasText +
        ' text: ' + textVal);

      ChatEntries.query(function(entries) {
        $scope.chatEntries = _.filter(entries, function(entry) {
          var passed = true;

          if (hasToday) {
            passed = (new Date().toDateString() === new Date(
              entry.created).toDateString());
          }

          if (hasTome) {
            passed = (entry.user && entry.user.nick === $scope.username);
          }

          if (hasUser) {
            passed = (entry.user && entry.user.nick === userVal);
          }

          if (hasText) {
            passed = (entry.value && entry.value.indexOf(
              textVal) > -1);
          }

          return passed;
        });
      });
    };

    $scope.deleteVisible = function(nick) {
      return $scope.username === nick;
    };

    $scope.handleNick = function() {
      console.log('handleNick:enter');
      $scope.find();
    };

    $scope.delete = function(entryId) {
      console.log('try to delete entry with id: ' + entryId);
      $http.delete('/chatEntries/' + entryId)
        .success(function(data, status, headers, config) {
          console.log('Succesfully deleted: ' + entryId);
          $scope.find();
        })
        .error(function(data, status, headers, config) {
          console.log('** Error when deleting: ' + entryId);
        });
    };

    var saveChatEntry = function(message, user) {
      var newShoutEntry = new ChatEntries({
        value: message,
      });
      newShoutEntry.$save({
          user: user
        },
        function(response) {
          console.log('Saved new chat entry with success!');
          $scope.find();
          $scope.message = '';
          updateTitle();
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
    };

    var updateTitle = function() {
      $scope.newMessagesCount++;
      $scope.title = '[' + $scope.newMessagesCount + '] Shout';
    };

    // @MAIN:
    $scope.title = 'Shout';
    $scope.newMessagesCount = 0;

    $scope.create();
    $scope.find();

    // // obtain http page content
    // var originChatUrl = 'http://www.forum.socjonika.pl/viewshout.php';
    // $http.get(originChatUrl)
    //   .success(function(data, status, headers, config) {
    //     console.log(data);
    //   })
    //   .error(function(data, status, headers, config) {
    //     console.log('ERROR!');
    //   });
  }
]);
