/**
 * Created by alisterpillow on 29/10/2014.
 */
'use strict';
angular.module('pekoeWorkspaceApp.tabs').directive('pekoeFrame', function() {
    return {
        restrict: 'A',
        scope: {tab: '='},
        controller: function ($scope, $element) {
            var resizer = function () {
                $element.width(angular.element('#work-area').width()-4); // arbitrary -4 to handle margins or borders or something
                var someMarginOrOther = 0;
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