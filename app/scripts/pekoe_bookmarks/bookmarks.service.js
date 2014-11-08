'use strict';

angular.module('pekoeWorkspaceApp.bookmarks')
    .factory('BookmarksService', ['$http', '$rootScope','AuthService', function ($http, $rootScope, AuthService ) {
        // Load and manage User bookmarks.
        // will provide
        // get
        // add
        // delete
        // move

        // This service will ask for the user's bookmarks.
        // First, it will
        // If there's no user (not logged in) then AuthService will fire

        var myTenant = AuthService.getTenant(); // this is a bootstrapping call.
        console.log('myTenant',myTenant);
        var myBookmarks = {groups:[]};


        function convertBookmarks() {

            return myBookmarks;
        }

        $rootScope.$on('tenant.update',function (){
            getBookmarks();
        });

        function getBookmarks() {
//            return $http.get('/exist/restxq/pekoe/user/bookmarks', {headers:{'Accept':'application/xml'}}).then(setBookmarks,reportError);
            return $http.get('/exist/restxq/pekoe/user/bookmarks').then(setBookmarks,reportError); // default header is "application/json"
        }

        // TODO setBookmarks is being called without a 'resp' from somewhere. Fix this.
        function setBookmarks(resp) {
            if (!resp) {
                console.warn('BookmarksService setBookmarks NO RESP');
                return;
            }
            myBookmarks = (resp.data.groups) ? resp.data : myBookmarks;
//            myBookmarks = (resp.xml) ? resp.xml.find('group') : [];
            console.log(myBookmarks);
            $rootScope.$broadcast('bookmarks.update');

            // TODO replace location
//            $location.path('/');
        }

        function reportError(resp) {
            console.warn('BookmarksService ERROR:',resp);
        }

//        function loadThings() {
//            // check to see if a tenant has been set.
//            console.log('BookmarksService loadThings');
//            AuthService.getTenant().then(getBookmarks); // don't proceed otherwise
////            getBookmarks();
//        }

        function updateMyBookmarks(b) {
            console.log('you want to update prefService Bookmarks',b);
        }
/*

        function changeTenant (tenant) {
            console.log('Changed tenant from',myTenant.key,'to',tenant.key);
            angular.element('#tenantPicker').modal('hide');
            myTenant = tenant;
            $http.defaults.headers.common.tenant = myTenant.key;
            // on change of tenant, need to reload bookmarks. HOW?
            $rootScope.$broadcast('tenant.update');
            getBookmarks().then(setBookmarks);
        }
*/

      //  loadThings(); // this is my call to get things started.



        // Public API here
        return  {
/*            getTenant: function () {
                return myTenant;
            },
            setTenant: function (tenant) { // view controller TenantCtrl will call this when the user selects a tenant
                changeTenant(tenant);
            },
            setTenants : function (tenants) {
                myTenants = tenants;
            },
            getTenants : function () {
                console.log('you asked for these tenants',myTenants);
                return myTenants;
            },*/
            bm : myBookmarks,
            getBookmarks: function () {
                return convertBookmarks();
            },
            setBookmarks: function (b) {
                updateMyBookmarks(b);
            },
            update: function () {
                console.log('Someone called BookmarksService.update()');
                getBookmarks();
            }
//            ,
//            getUser : function () {
//                return myUser;
//            }

        };
    }]);
