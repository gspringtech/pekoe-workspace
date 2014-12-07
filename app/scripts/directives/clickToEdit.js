'use strict';
/**
 * Created by alisterpillow on 17/11/2014.
 * Copied from http://icelab.com.au/articles/levelling-up-with-angularjs-building-a-reusable-click-to-edit-directive/
 */

angular.module('pekoeWorkspaceApp')
    .directive('contenteditable', function (){
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        function read() {
          ngModel.$setViewValue(element.html());
        }

        ngModel.$render = function () {
          element.html(ngModel.$vieValue || '');
        };

        element.bind('blur change',function() {
          scope.$apply(read);
        });
      }
    };
  });
