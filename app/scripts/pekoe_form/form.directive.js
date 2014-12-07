'use strict';
/**
 * Created by alisterpillow on 4/11/2014.
 */
angular.module('pekoeWorkspaceApp.form')
    .directive('pekoeForm', function ($compile) { // always remember to camelCase the name otherwise the directive won't work.
        return {
            restrict: 'E',
            template: '<div>Pekoe Form for {{tab.title}}, at href {{tab.href}}</div>',
            replace: true,
            controller: function ($element,$scope, FormService) {
                $element.append($compile(FormService.getTree())($scope)); // This works - don't break it!!!!!!!
//                $compile($element);
            },
            link: function(scope,element,attrs) {
                console.log('List scope is',scope);
                console.log('List elment is',element);
                console.log('List attrl is',attrs);
                console.log('scope.tab is',scope.tab);
//                $compile(element);
//                element.append(FormService.getTree());
                // commented... is the lodash version using _.debounce to reduce the number of calls.
                // might be worth using if resize is a problem for many tabs.

//          angular.element($window).on('resize', $window._.debounce(function() {
//              scope.$broadcast('resize::resize');
//          },500));


            }
        };
    })
    .directive('pekoeFieldset',function (){
        return {

        restrict: 'E',
            template: '<fieldset><legend>The Tree</legend></fieldset>',
            replace: true,
            controller: function () { // $element,$scope, FormService

console.log('fieldset controller');
        },
        link: function() {
            //scope,element,attrs
//            console.log('List scope is',scope);
//            console.log('List elment is',element);
//            console.log('List attrl is',attrs);

        }
    };
    });

/*
 <iframe ng-src="{{tab.href | trustedUrl}}" pekoe-frame class="pekoeFrame"></iframe>
 */

