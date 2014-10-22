'use strict';

// this is a module Creator
angular
    .module('pekoeWorkspaceApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'http-auth-interceptor', // lib/angular-http-auth-master/src/http-auth-interceptor.js
        'customDirectives',
        'xml'
//        'ui.tree'
    ])
    .config(function ($locationProvider) {
//        $routeProvider
//            .when('/', {
//                templateUrl: 'views/main.html',
//                controller: 'MainCtrl'
//            })
//            .when('/login', {
//                // I really want this to appear in a tab or pop-over.
//                templateUrl: 'views/login.html'
//            })
//            .when('/tenant',{
//                templateUrl: 'views/tenant.html'
//            })
//            .when('/logout', {
//                // somehow, send a logout signal to exist
//                templateUrl: 'views/goodbye.html',
//                controller: 'LogoutCtrl' //,
////                redirectTo: '/'
//            })
//            // consider any other paths as possible Load Items.
//            .otherwise({
//                redirectTo: '/'
//            });
        $locationProvider.html5Mode(true);
    })
    .config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|collection|form|xql):/); // TODO check this sanitization
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('xmlHttpInterceptor');
    });

/*
http-auth-interceptor broadcasts event:auth-loginRequired
which is handled by PrefsService
 */