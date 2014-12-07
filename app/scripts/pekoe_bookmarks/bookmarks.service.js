'use strict';

angular.module('pekoeWorkspaceApp.bookmarks')
    .factory('BookmarksService', ['$http', '$rootScope', function ($http, $rootScope) {
        // Load and manage User bookmarks.
        // will provide
        // get
        // add
        // delete
        // move
        // TODO Bookmarks need a Class and Icon (Form, List, Report etc)

        var myBookmarks = {groups: [], dirty: false};

        //function convertBookmarks() {
        //    return myBookmarks;
        //}

        $rootScope.$on('tenant.update', function () { // Broadcast from auth.service
            getBookmarks();
        });

        function getBookmarks() {
            return $http.get('/exist/restxq/pekoe/user/bookmarks').then(setBookmarks, reportError); // default header is "application/json"
        }

        function setBookmarks(resp) {
            if (!resp) {
                console.warn('BookmarksService setBookmarks NO RESP');
                return;
            }
            myBookmarks = (resp.data.groups) ? resp.data : myBookmarks;
            $rootScope.$broadcast('bookmarks.update');
        }

        function reportError(resp) {
            console.warn('BookmarksService ERROR:', resp);
        }

        function openGroup() {
            var current = myBookmarks.groups[0];
            angular.forEach(myBookmarks.groups, function (group) {
                if (group.open) {
                    current = group;
                    return false; // probably unnecessary as this is such a small array.
                }
            });
            return current;
        }

        var tabInItems = function (tab, items) {
            var inItems = false;
            for (var i in items) {
                if (items[i].href === tab.href) {
                    inItems = true;
                    break;
                }
            }
            return inItems;
        };

        function addTabToCurrentGroup(tab) {
            // TODO make this turn on Edit Mode
            console.log('BookmarksService add tab',tab);
            if (!tab.title || tab.title === '') {
                console.warn('No title for tab',tab);
                return;
            } // must have a title
            var grp = openGroup();

            if (tabInItems(tab,grp.items)) {
                console.warn('Tab already in group');
                return;
            }
            try {
                var bm = {title: tab.title, href: tab.href, type: tab.type};
                if (tab.params) bm.params = tab.params;
                //var bm = angular.copy(tab); // includes too much - like the frameWindow I've added.
                grp.items.push(bm);
                console.log('add to grp', grp);
            } catch (e) {console.warn('add error',e);}
            myBookmarks.dirty = true;
        }


        // Public API here
        return {
            addToCurrentGroup: function (tab) {
                addTabToCurrentGroup(tab);
            },
            bookmarks: function () {
                return myBookmarks;
            },
            loadBookmarks: function () {
                return getBookmarks();
            },
            update: function () {
                getBookmarks();
            }

        };
    }]);
