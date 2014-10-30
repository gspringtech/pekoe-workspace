'use strict';

/**
 * @ngdoc directive
 * @name pekoeWorkspaceApp.directive:draggableTab
 * @description
 * # draggableTab
 */
angular.module('pekoeWorkspaceApp')
  .directive('draggableTab', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
          attrs.$set('draggable',true);
      }
    };
  });
