'use strict';

angular.module('pekoeWorkspaceApp')
    .factory('PrefsService', ['$http', '$rootScope', '$location', function ($http, $rootScope, $location) {
        // Manage tenant, user, bookmarks
      /*
      This might be easier if the response was XML. Particularly the .isArray bit.
       */

        var myBookmarks = [];
        var myUser = '';
        var myTenant = {key:'none', name:'No tenant'};
        var myTenants = [];
        $http.defaults.headers.common.tenant = myTenant.key;

        function setTenant(resp) {
            // will only get a successful response
            console.log('setTenant got data');
            // either one tenant or a bunch. If one, it's immediately set.
            // if a bunch, then show the selector.
            myUser = resp.data.for;
            console.log('setTenant got myUser',myUser);
            if (angular.isArray(resp.data.tenant)){
                console.log('PrefsService setTenant got Array');
                myTenants = resp.data.tenant;
                $location.url('tenant');
            } else if (resp.data.tenant.key) {
                myTenant =  resp.data.tenant;
                $http.defaults.headers.common.tenant = myTenant.key;

            }
            $rootScope.$broadcast('tenant.update');
//            myTenants = resp.data.tenant; // tenant: {key:'tdbg', name:'The Database Guy'}
//
//
//
//            $rootScope.$broadcast('tenant.update');
//            if (myTenant = 'none' && myTenants.length > 0) {
//                // defer the next step somehow
//                $location.url('tenant');
//            }

            return resp;
        }

        function getBookmarks() {
            return $http.get('/exist/restxq/pekoe/user/bookmarks');
        }

        function setBookmarks(resp) {
            console.log('setting values in PrefsService',resp.data.item);
            myBookmarks = (resp.data.item) ? resp.data.item : {};
            $rootScope.$broadcast('bookmarks.update');
        }

        function reportError(resp) {
            console.warn('PrefsService ERROR:',resp);
        }

        function loadThings() {
            $http.get('/exist/restxq/pekoe/tenant')
                .then(setTenant)
                .then(getBookmarks)
                .then(setBookmarks,reportError);
        }

        function updateMyBookmarks(b) {
            console.log('you want to update prefService Bookmarks',b);
        }

        function changeTenant (tenant) {
            console.log('Changed tenant from',myTenant,'to',tenant);
            myTenant = tenant;
            $http.defaults.headers.common.tenant = myTenant.key;
            // on change of tenant, need to reload bookmarks. HOW?
            $rootScope.$broadcast('tenant.update');
            getBookmarks().then(setBookmarks);
        }

        loadThings();


        // Public API here
        return  {
            getTenant: function () {
                return myTenant;
            },
            setTenant: function (tenant) { // view controller TenantCtrl will call this when the user selects a tenant
                changeTenant(tenant);
            },
            setTenants : function (tenants) {
                myTenants = tenants;
            },
            getTenants : function () {
                return myTenants;
            },

            getBookmarks: function () {
                return myBookmarks;
            },
            setBookmarks: function (b) {
                updateMyBookmarks(b);
            },
            update: function () {
                getBookmarks();
            },
            getUser : function () {
                return myUser;
            }

        };
    }]);
