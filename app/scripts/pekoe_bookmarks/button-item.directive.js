/**
 * Created by alisterpillow on 22/11/2014.
 */
'use strict';
angular.module('pekoeWorkspaceApp.bookmarks')
    .directive('pekoeButtonItem', function () { // always remember to camelCase the name otherwise the directive won't work.
        return {
            restrict: 'E',
            templateUrl: 'views/button-item.html',
            controller: function (){
                //console.log('buttonItem controller element',$element,'$scope',$scope);

            },
            replace: true,

            link: function() {

                //console.log("link function ",scope, element);
            }
        };
    });
