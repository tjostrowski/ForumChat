'use strict';

(function() {

  var ngEnterDirective = function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('keydown keypress', function(event) {
          if (event.which === 13) {
            scope.$apply(function() {
              scope.$eval(attrs.ngEnter);
            });

            event.preventDefault();
          }
        });
      }
    };
  };

  angular.module('core').directive('ngEnter', ngEnterDirective);
})();
