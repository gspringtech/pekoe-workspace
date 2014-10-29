'use strict';

/**
 * @ngdoc directive
 * @name pekoeWorkspaceApp.directive:resize
 * @description
 * # resize
 */
angular.module('pekoeWorkspaceApp')
  .directive('resize', function ($window) {
    return {
      restrict: 'A',
      link: function(scope) {
          // this is the lodash version using _.debounce to reduce the number of calls.
          // might be worth using if resize is a problem for many tabs.

//          angular.element($window).on('resize', $window._.debounce(function() {
//              scope.$broadcast('resize::resize');
//          },500));

          angular.element($window).on('resize', function(e) {
              // Namespacing events with name of directive + event to avoid collisions
              scope.$broadcast('resize::resize');
          });
      }
    };
  });

