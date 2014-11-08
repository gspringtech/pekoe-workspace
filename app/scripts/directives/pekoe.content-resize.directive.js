'use strict';

/**
 * @ngdoc directive
 * @name pekoeWorkspaceApp.directive:resize
 * @description
 * # resize
 * I've applied this to the #work-area
 * It broadcasts an event which must be listened - and the "pekoe-frame" directive is the listener.
 * TODO consider changing this to take a parameter which identifies the element that needs changing.
 * OR maybe simply perform this function (... broadcast) in the pekoe-frame resizing directive.
 * Only problem with that approach is that the event will be added for each Tab (maybe).
 */
angular.module('pekoeWorkspaceApp')
  .directive('pekoeSayResize', function ($window) {
    return {
      restrict: 'A',
      link: function(scope) {
          // commented... is the lodash version using _.debounce to reduce the number of calls.
          // might be worth using if resize is a problem for many tabs.

//          angular.element($window).on('resize', $window._.debounce(function() {
//              scope.$broadcast('resize::resize');
//          },500));
    // NOTE this resize is being sent when content is first added to the work-area
          angular.element($window).on('resize', function() {
              // Namespacing events with name of directive + event to avoid collisions
              console.log('broadcasting resize event');
              scope.$broadcast('resize::resize');
          });
      }
    };
  });

angular.module('pekoeWorkspaceApp').directive('pekoeDoResize', function() {
    return {
        restrict: 'A',
        scope: {tab: '='},
        controller: function () {
//            var resizer = function () {
//                console.log('got call to do resize');
//                // TODO I should probably make this work based on a parent element provided as a parameter.
//                $element.width(angular.element('#work-area').width()-4); // arbitrary -4 to handle margins or borders or something
//                var someMarginOrOther = 20;
//                $element.height(angular.element('#footer').position().top - angular.element('.tab-content').position().top - someMarginOrOther);
//            };
//
//            console.log('doResize controller');
////            resizer();
//            // resize directive is attached to #work-area
//            $scope.$on('resize::resize', function() {
//                resizer();
//            });
            /*
            The problem is the initial call to tab-content resize. It's not taking into account the height of the tab nav area.
            It's fine when the screen is actually resized, but not right prior to that.
            Will either have to base it on the Bottom of the Tab nav or subtract that amount.
            Also would be good to call this prior to setting any content - but don't think that's possible.
             */

        },
        link: function ($scope,$element) {
            var resizer = function () {
                console.log('got call to do resize');
                // TODO I should probably make this work based on a parent element provided as a parameter.
                $element.width(angular.element('#work-area').width()-4); // arbitrary -4 to handle margins or borders or something
                var someMarginOrOther = 20;
                $element.height(angular.element('#footer').position().top - angular.element('.tab-content').position().top - someMarginOrOther);
            };


            resizer();
            // resize directive is attached to #work-area
            $scope.$on('resize::resize', function() {
                resizer();
            });
        }
    };


});
