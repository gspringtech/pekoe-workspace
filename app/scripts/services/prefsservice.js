'use strict';

angular.module('pekoeWorkspaceApp')
    .factory('PrefsService', ['$http', '$rootScope', function ($http, $rootScope ) {
        // Manage tenant, user, bookmarks
      /*
      This might be easier if the response was XML. Particularly the .isArray bit.
       */

        var myBookmarks = null;
        var myUser = '';
        var myTenant = {key:'none', name:'No tenant'};
        var myTenants = [];
        $http.defaults.headers.common.tenant = myTenant.key;

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

        function setTenant(resp) {
            // will only get a successful response
            console.log('setTenant got data');
            // either one tenant or a bunch. If one, it's immediately set.
            // if a bunch, then show the selector.
            myUser = resp.data.for;
            if (angular.isArray(resp.data.tenant)){
                myTenants = resp.data.tenant;
                // TODO replace location
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

        function getBookmarks() {
            console.log('function getBookmarks');
            return $http.get('/exist/restxq/pekoe/user/bookmarks');
        }

        // TODO setBookmarks is being called without a 'resp' from somewhere. Fix this.
        function setBookmarks(resp) {
            if (!resp) {
                console.warn('prefsService setBookmarks NO RESP');
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
            console.warn('PrefsService ERROR:',resp);
        }

        function loadThings() {
            $http.get('/exist/restxq/pekoe/tenant')
                .then(setTenant)
                .then(setBookmarks,reportError);
        }

        function updateMyBookmarks(b) {
            console.log('you want to update prefService Bookmarks',b);
        }

        function changeTenant (tenant) {
            console.log('Changed tenant from',myTenant.key,'to',tenant.key);
            myTenant = tenant;
            $http.defaults.headers.common.tenant = myTenant.key;
            // on change of tenant, need to reload bookmarks. HOW?
            $rootScope.$broadcast('tenant.update');
            getBookmarks().then(setBookmarks);
        }

        loadThings();

        $rootScope.$on('event:auth-loginConfirmed',function () {
            console.log('Got event:auth-loginConfirmed');
            $('#myModal').modal('hide');
        });

        $rootScope.$on('event:auth-loginRequired',function () {
           console.log('GOT AUTH-LOGINREQUIRED EVENT');
//            $location.path('/login');
            $('#myModal').modal('show');
        });


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
                return convertBookmarks();
            },
            setBookmarks: function (b) {
                updateMyBookmarks(b);
            },
            update: function () {
                console.log('Someone called PrefsService.update()');
                getBookmarks();
            },
            getUser : function () {
                return myUser;
            }

        };
    }]);
