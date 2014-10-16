'use strict';

// See http://subliminalsources.com/175/angularjs-bootstrap-components-tutorials-part-3-building-tabs-directive/
// or http://blog.hfarazm.com/tabs-in-angularjs/
// also http://www.airpair.com/angularjs

// this is a module Lookup...
angular.module('pekoeWorkspaceApp')
    .controller('MainCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });


/*
 example of dynamic directive with controller.
 See
 http://stackoverflow.com/questions/15279244/dynamically-add-directives-on-angularjs
 (for other examples)

 angular.module("pekoeWorkspaceApp").directive('test', function ($compile) {
 return {
 restrict: 'E',
 scope: { text: '@'},
 template: '<p ng-click="add()">{{text}}</p>',
 controller: function ($scope, $element ) {
 $scope.add = function () {
 var el = $compile("<test text='n'></test>") ($scope);
 $element.parent().append(el);
 };
 }
 };
 });

 */