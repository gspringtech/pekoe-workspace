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

// this is a module Creator
angular
    .module('pekoeWorkspaceApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'http-auth-interceptor', // lib/angular-http-auth-master/src/http-auth-interceptor.js
//        'customDirectives',
        'xml',                   // https://github.com/johngeorgewright/angular-xml
        'ngDragDrop',
        'ui.bootstrap',
        'ui.sortable',
        'pekoeWorkspaceApp.auth',
        'pekoeWorkspaceApp.bookmarks',
        'pekoeWorkspaceApp.tabs'
    ])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|collection|form|xql):/); // TODO check this sanitization
    })
    .config(function ($httpProvider) {
//        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('xmlHttpInterceptor');
    })
  .run(function($rootScope,AuthService){
      $rootScope.tenant = AuthService.getTenant(); // This is my bootstrap call.
  });

/*
http-auth-interceptor broadcasts event:auth-loginRequired
which is handled by AuthService
 */

/*
 $templateCache.put('template/accordion/accordion-group.html', '<div class="accordion-group" ng-class="{ \'active\': isOpen }">' +
 '<div class="accordion-heading" ><a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a></div>' +
 '<div class="accordion-body" collapse="!isOpen">' +
 '<div class="accordion-inner" ng-transclude></div>' +
 '</div>' +
 '</div>');
 https://github.com/angular-ui/bootstrap/issues/1262
 */
