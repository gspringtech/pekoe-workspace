'use strict';

// this is a module Creator
angular
    .module('pekoeWorkspaceApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
//        'ui.tree'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/login', {
                // I really want this to appear in a tab or pop-over.
                templateUrl: 'views/login.html'
            })
            .when('/tenant',{
                templateUrl: 'views/tenant.html'
            })
            .when('/logout', {
                // somehow, send a logout signal to exist
                templateUrl: 'views/goodbye.html',
                controller: 'LogoutCtrl' //,
//                redirectTo: '/'
            })
            // consider any other paths as possible Load Items.
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|collection|form|xql):/);
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
