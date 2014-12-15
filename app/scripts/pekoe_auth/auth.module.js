/**
 * Created by alisterpillow on 25/10/2014.
 */
'use strict';
angular.module('pekoeWorkspaceApp.auth', [])
    .directive('formAutofillFix', function () {
        // http://victorblog.com/2014/01/12/fixing-autocomplete-autofill-on-angularjs-form-submit/
        return function (scope, elem, attrs) {
            // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
            elem.prop('method', 'POST');
            console.log('fixing autofill');
            // Fix autofill issues where Angular doesn't know about autofilled inputs
            if (attrs.ngSubmit) {

                setTimeout(function () {
                    elem.unbind('submit').submit(function (e) {
                        e.preventDefault();
                        elem.find('input, textarea, select').trigger('input').trigger('change').trigger('keydown');
                        scope.$apply(attrs.ngSubmit);
                    });
                }, 0);
            }
        };
    })
    .directive('logout', ['AuthService', function (AuthService) {

        return {
            template: '<button ng-click="logout()" class="btn" title="Close jobs and Logout"><i class="glyphicon glyphicon-log-out"></i></button>',
            restrict: 'E',
            link: function postLink(scope) {
                scope.logout = function () {
                    console.log('you clicked logout');
                    AuthService.logout();
                };
            }
        };

    }]);
