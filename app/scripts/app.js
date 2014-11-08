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
        'pekoeWorkspaceApp.tabs',
//        'pekoeWorkspaceApp.list',
        'pekoeWorkspaceApp.form'
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
    });

/*
http-auth-interceptor broadcasts event:auth-loginRequired
which is handled by AuthService
 */