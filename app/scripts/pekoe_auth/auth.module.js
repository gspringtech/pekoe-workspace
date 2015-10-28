/**
 * Created by alisterpillow on 25/10/2014.
 *
 * Pekoe Workspace provides a wrapper for the Pekoe Job Manager
 * Copyright (C) 2009,2010,2011-2014 Geordie Springfield Pty Ltd (Australia)
 * Author: Alister Pillow alisterhp@me.com

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */
'use strict';
angular.module('pekoeWorkspaceApp.auth', [])
    .directive('formAutofillFix', function () {
        // http://victorblog.com/2014/01/12/fixing-autocomplete-autofill-on-angularjs-form-submit/
        return function (scope, elem, attrs) {
            // Fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
            elem.prop('method', 'POST');
            //console.log('fixing autofill');
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
            template: '<button ng-click="logout()" class="btn" title="Close jobs and Logout"><i class="glyphicon glyphicon-log-out"></i> Logout</button>',
            restrict: 'E',
            link: function postLink(scope) {
                scope.logout = function () {
                    //console.log('you clicked logout');
                    AuthService.logout();
                };
            }
        };

    }]);
