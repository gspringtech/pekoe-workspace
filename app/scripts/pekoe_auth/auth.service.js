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
angular.module('pekoeWorkspaceApp.auth')
.factory('AuthService',['$rootScope', '$modal', '$http', 'authService','$cookieStore', '$q',function($rootScope, $modal, $http, authService, $cookieStore, $q){

        // this _could_ work, but this constructor needs to be encapsulated so that the whole thing isn't made part of
    if (window.parent !== window) { // must be a child frame
        // all I really need is the tenant
        // Auth should be able to handle the re-login regardless of whether the action is in a Frame or Parent.
        // alternatively, an auth-intercept handler could get the tenant header and use that.
        // then no need to ask the parent for anything.

//        Only problem is that I want an API for handle
    }


    var myUser, myTenant, myTenants, open=false; //, modalInstance;

    var init = function () {
        myUser = {id:'',fullname:''};
        myTenant = {key:'none', name:'No tenant'};
        myTenants = [];
        $http.defaults.headers.common.tenant = myTenant.key; //   TODO Set a cookie instead.
    };
    init();

    //var startup = function () {
    //    var parent = window.parent;
    //    if (parent !== window) { // then it must be a parent frame - and it _should_ have an AuthService
    //        //console.log('parent frame exists');
    //        //console.log('tenant', parent.pekoeTenant);
    //        myTenant = parent.pekoeTenant; // this should be a call to AuthService.getTenant();
    //    }
    //};

        /*
         This is my bootstrapping function for Pekoe Workspace.
         No tenant results in a call to the server.
         Not logged-in? Results in an auth event
         Post login - back to get tenant
         If only one tenant, then set it and broadcast 'tenant.update' event (this will cause a bookmarks refresh)
         If more than one tenant, the ChooseTenant modal will be displayed.
         Handle Cancels and other errors
             */

    function getCurrentTenant() { // 2014-11-16 Yes
        //console.log('Bootstrap call to getCurrentTenant');
        if (myTenant.key !== 'none') {
            //console.log('AuthService already has tenant:', myTenant.key);
            $q.defer().resolve(myTenant.key);
            return myTenant;
        } else {
            //console.log('AuthService needs to getTenants from server');
            var t = getTenants();
            return t;
        }
    }
    // ----------------- STARTUP
//    getCurrentTenant(); // Called by app.js .module().run()
    // -----------------
    var myLogout = function () {
        $rootScope.$broadcast('authservice::logout');
        init();
        var modalInstance = $modal.open({
            template: '<div class="modal-header"><h2>Closing your files...</h2></div>'
        });
        $http.get('/exist/pekoe-app/logout.xql').success(function () {
            location.reload();
        });
        //location.reload();
    };

    function getTenants() {
        return $http.get('/exist/restxq/pekoe/tenant').then(chooseTenant);
    }

    function tenantUpdate(){
        //console.log('set tenant and user in tenantUpdate');
        $cookieStore.put('tenant',myTenant.key);
        $http.defaults.headers.common.tenant = myTenant.key;
        window.pekoeTenant = myTenant;
        authService.tenantConfirmed(myTenant.key,
            function (config) {
                config.headers.tenant = myTenant.key;
                return config;
            });
        $rootScope.$broadcast('tenant.update');
    }

    function chooseTenant(response) {

        if (response.xml) {
            var user = response.xml.find('tenants').attr('for');
            myUser = user;
            $rootScope.myUser = user;
            var tenants = response.xml.find('tenant');
            if (tenants.length === 1) {
                myTenant = {key: tenants.attr('key'), name: tenants.attr('name')};
               tenantUpdate();
            } else { // Show choice
                var t;
                var ts = [];
                for (var i = 0; i < tenants.length; i += 1) {
                    t = angular.element(tenants[i]);
                    ts.push({
                        name: t.attr('name'),
                        key: t.attr('key')
                    });
                }
                myTenants = ts;

                var modalInstance = $modal.open({
                    templateUrl: 'views/tenant.html',
                    controller: 'TenantModalCtrl',
                    controllerAs: 'tcl',
                    size: 'lg',
                    background: 'static',
                    resolve: {
                        tenants: function () {
                            console.log('Got my tenants',myTenants);
                            return myTenants;
                        },
                        tenant: function () {
                            return myTenant;
                        }
                    }
                });
                modalInstance.result.then(
                    function (result) {
                        myTenant = result;
                        //console.log('Tenant selected', result);
                        tenantUpdate();
                    },
                    function (errorResult) {
                        console.warn('No Tenant',errorResult);
                    });

            }
        } else {
            console.error('No tenants found.', response);
        }

    }

    function noTenantError(response) {
        console.warn('No tenants found',response);
    }

    function loginSucceeded(user) {
        console.log('loginsucceeded for',user);
        myUser = user;
        $rootScope.myUser = user;
        // because I passed the myUser object in to the modal, its id has been updated
        open = false;
        // this doesn't seem to run
        console.log('authService.loginConfirmed()');
        authService.loginConfirmed();

    }

    function loginFailed(result) {
        open = false;
        console.warn('Login Modal closed without success at',new Date(), 'with reason',result);
        if (result.headers('location')){
            console.warn(result.xml);
        }
    }

    function showLogin() {
        //if (modalInstance) {console.log("Instance already exists of this Modal"); return;}
        console.log('going to show login',$modal, open);
        if (!open) {
            open = true;
            var modalInstance = $modal.open({
                templateUrl: 'views/login.html',
                backdrop: 'static',
                controller: 'AuthModalCtrl',
                size: 'lg',
                resolve: {
                    user: function () {
                        return myUser;
                    }
                }
            });
            modalInstance.result.then(loginSucceeded, loginFailed);
        }


    }

    // might want to use this for testing. setTenant('') should cause a tenant request and Bookmark update
//    function setTenant (response) {
////        console.log('setTenant got ',response);
//    }

    // this is in case the tenant is lost somehow - the server will send an error. 412 Precondition Failed
    $rootScope.$on('event:auth-tenantRequired',function () {
            //console.log('GOT TENANT REQUIRED EVENT');
            // Do I have a tenant yet? It's possible - if this is a time-out login-again scenario
            // kill any previous requests
            authService.loginCancelled(); // TODO check whether this is needed.
            getTenants().then(chooseTenant, noTenantError);
        });

    $rootScope.$on('event:auth-loginRequired',function () {
        //console.log('GOT AUTH-LOGINREQUIRED EVENT');

        // my modal is not getting either of its .then methods called - the http-auth-interceptor catches
        // the results and fires another auth-loginRequired event.
        showLogin();

    });

    var service = {  // Public functions available from AuthService. Are these used? Needed?
        getTenant: function () {
            //console.log('AuthService.getTenant');
            return getCurrentTenant();
        },
        logout : function () {
            myLogout();
        },
        setTenants : function (tenants) {
            //console.log('AuthService.setTenants');
            myTenants = tenants;
        },
        getTenants : function () {
            //console.log('AuthService.getTenants:',myTenants);
            return myTenants;
        }
    };
    // TODO - check whether this is useful.
    if (window.parent === window) { // I am a parent window
            window.AuthService = service;
        }
    return service;
    }]);

angular.module('pekoeWorkspaceApp.auth')
    .controller('AuthModalCtrl',['$scope', '$http', '$modalInstance','user', function($scope, $http, $modalInstance, user){
        $scope.user = user;
        $scope.password = '';
        $scope.submit = function () {
            $http
                .post('/exist/j_security_check',
                    'j_username=' + $scope.user.id + '&j_password=' + $scope.password,
                    {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'} })
                .then(
                    function (){
                        console.log('got a result');
                        $modalInstance.close($scope.user);
                    },
                    function (rejected){
                        // the problem is that we don't even get here. When authentication fails, another login-required event is fired.
                        console.warn('AuthModalCtr - login rejected',rejected);
                        $modalInstance.close();

                    });
        };
    }]);

angular.module('pekoeWorkspaceApp.auth')
    .controller('TenantModalCtrl',['$scope', '$modalInstance', 'tenants', 'tenant', function($scope, $modalInstance, tenants, tenant){
        //console.log('tenants',tenants);
        $scope.tenants = tenants;
        $scope.myTenant = tenant;
        $scope.changeTenant = function (newTenant) {
            $modalInstance.close(newTenant);
        };

    }]);
