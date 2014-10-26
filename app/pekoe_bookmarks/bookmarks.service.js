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


        var myBookmarks = [];


        function convertBookmarks() {
            // bookmarks are xml
            /*
            angular won't process {{item.attr('title')}}
            but what about a filter?
            This is where I'm thinking maybe the proxy system could decorate the xml with accessors.
             */
            /*
             <bookmarks for="tdbg@thedatabaseguy.com.au" tenant="tdbg">
             <group title="Favourites...">
             <item title="Welcome" href="xql:files/Welcome.xql"></item>
             <item title="Files" href="collection:files" type="list"></item>
             <item title="Education" href="collection:files/education" type="list"></item>
             <item title="Booking List" href="list:files/education/Booking-list.xql" type="report"></item>
             </group>
             <group title="Reports...">
             <item title="Visits" href="collection:files" type="report"></item>
             </group>
             </bookmarks>

             */
//            var list = [];
            return myBookmarks;
        }

/*
        function setTenant(resp) {
            // will only get a successful response
            console.log('setTenant got data');
            // either one tenant or a bunch. If one, it's immediately set.
            // if a bunch, then show the selector.
            myUser = resp.data.for;
            if (angular.isArray(resp.data.tenant)){
                myTenants = resp.data.tenant;
                // TODO replace location
                angular.element('#tenantPicker').modal('show');
//                $location.url('tenant'); // rely on setTenant to call getBookmarks
            } else if (resp.data.tenant.key) {
                myTenant =  resp.data.tenant;
                console.log('setTenant got single tenant:',myTenant.key);
                $http.defaults.headers.common.tenant = myTenant.key;
                //$rootScope.$broadcast('tenant.update');
                // I feel this could be done better - but it works -sort of.
                return getBookmarks();
            }
            // reject
        }
        */

        $rootScope.$on('tenant.update',function (){
            getBookmarks();
        });

        function getBookmarks() {
            console.log('function getBookmarks');

//            if (AuthService.tenant.key === 'none') {
//                return $http.get('')
//
//            }
            return $http.get('/exist/restxq/pekoe/user/bookmarks').then(setBookmarks,reportError);
        }

        // TODO setBookmarks is being called without a 'resp' from somewhere. Fix this.
        function setBookmarks(resp) {
            if (!resp) {
                console.warn('BookmarksService setBookmarks NO RESP');
                return;
            }
//            myBookmarks = (resp.data.group) ? resp.data.group : {};
            myBookmarks = (resp.xml) ? resp.xml.find('group') : [];
            console.log(myBookmarks);
            $rootScope.$broadcast('bookmarks.update');

            // TODO replace location
//            $location.path('/');
        }

        function reportError(resp) {
            console.warn('BookmarksService ERROR:',resp);
        }

        function loadThings() {
            // check to see if a tenant has been set.
            console.log('BookmarksService loadThings')
            AuthService.getTenant().then(getBookmarks); // don't proceed otherwise
//            getBookmarks();
        }

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
