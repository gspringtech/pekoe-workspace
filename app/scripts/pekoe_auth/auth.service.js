/**
 * Created by alisterpillow on 25/10/2014.
 */
'use strict';
angular.module('pekoeWorkspaceApp.auth')
.factory('AuthService',['$rootScope', '$modal', '$http', 'authService', '$q',function($rootScope, $modal, $http, authService, $q){

    var myUser =  {
        id:'',
        fullname:''
    };
    var myTenant = {key:'none', name:'No tenant'};
    var myTenants = [];
    $http.defaults.headers.common.tenant = myTenant.key;


    /*
     This is my bootstrapping function for Pekoe Workspace.
     No tenant results in a call to the server.
     Not logged-in? Results in an auth event
     Post login - back to get tenant
     If only one tenant, then set it and broadcast 'tenant.update' event (this will cause a bookmarks refresh)
     If more than one tenant, the ChooseTenant modal will be displayed.
     Handle Cancels and other errors
         */
    function getCurrentTenant() {
        // Check for a parent frame:
        console.log('Bootstrap call to getCurrentTenant');
        var parent = window.parent;
        if (parent !== window) {
            console.log('parent frame exists');
            console.log('tenant', parent.pekoeTenant);
            myTenant = parent.pekoeTenant;
        }

        if (myTenant.key !== 'none') {
            console.log('AuthService already has tenant:', myTenant.key);
            $q.defer().resolve(myTenant.key);
        } else {
            console.log('AuthService needs to getTenants from server');
            var t = getTenants();
            console.log('getTenants returns:',t);
            return t;
        }
    }
    // ----------------- STARTUP
//    getCurrentTenant(); // A bootstrap call. This is working. Still some confusing logic here
    // -----------------


    function getTenants() {
        return $http.get('/exist/restxq/pekoe/tenant').then(chooseTenant);
    }

    function tenantUpdate(){
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
            var tenants = response.xml.find('tenant');
            if (tenants.length === 1) {
                myTenant = {key: tenants.attr('key'), name: tenants.attr('name')};
                console.log('ONE TENANT myTenant', myTenant);
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
                    templateUrl: 'scripts/pekoe_auth/tenant.html',
                    controller: 'TenantModalCtrl',
                    controllerAs: 'tcl',
                    size: 'lg',
                    background: 'static',
                    resolve: {
                        tenants: function () {
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
                        console.log('Tenant selected', result);
                        tenantUpdate();
                    },
                    function (errorResult) {
                        console.log('No Tenant',errorResult);
                    });

            }
        } else {
            console.error('No tenants found.');
        }

    }

    function noTenantError(response) {
        console.warn('No tenants found',response);
    }

    function loginSucceeded() {
        // because I passed the myUser object in to the modal, its id has been updated
        authService.loginConfirmed();
    }

    function loginFailed(result) {
        console.warn('Login Modal closed without success at',new Date(), 'with reason',result);
        if (result.headers('location')){
            console.log(result.xml);
        }
    }

    function showLogin() {
        var modalInstance = $modal.open({
           templateUrl: 'scripts/pekoe_auth/login.html',
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

    // might want to use this for testing. setTenant('') should cause a tenant request and Bookmark update
//    function setTenant (response) {
//        console.log('setTenant got ',response);
//    }

    // this is in case the tenant is lost somehow - the server will send an error. 412 Precondition Failed
    $rootScope.$on('event:auth-tenantRequired',function () {
            console.log('GOT TENANT REQUIRED EVENT');
            // Do I have a tenant yet? It's possible - if this is a time-out login-again scenario
            // kill any previous requests
            authService.loginCancelled(); // TODO check whether this is needed.
            getTenants().then(chooseTenant, noTenantError);
        });

    $rootScope.$on('event:auth-loginRequired',function () {
        console.log('GOT AUTH-LOGINREQUIRED EVENT');
        // Do I have a tenant yet? It's possible - if this is a time-out login-again scenario
        showLogin();
    });


    return {  // Public functions available from AuthService. Are these used? Needed?
        getTenant: function () {
            console.log('AuthService.getTenant');
            return getCurrentTenant();
        },
//        setTenant: function (tenant) {
//            console.log('AuthService.setTenant');
//            changeTenant(tenant);
//        },
        setTenants : function (tenants) {
            console.log('AuthService.setTenants');
            myTenants = tenants;
        },
        getTenants : function () {
            console.log('AuthService.getTenants:',myTenants);
            return myTenants;
        }
    };
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
                .then(function (){
                    $modalInstance.close($scope.user);
                },
                function (rejected){
                    console.warn('login succeeded but received 412. Not handled',rejected);
                });
        };
    }]);

angular.module('pekoeWorkspaceApp.auth')
    .controller('TenantModalCtrl',['$scope', '$modalInstance', 'tenants', 'tenant', function($scope, $modalInstance, tenants, tenant){
        console.log('tenants',tenants);
        $scope.tenants = tenants;
        $scope.myTenant = tenant;
        $scope.changeTenant = function (newTenant) {
            $modalInstance.close(newTenant);
        };

    }]);