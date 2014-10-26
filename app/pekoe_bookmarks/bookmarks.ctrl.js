'use strict';

// SEE this example http://localhost/exist/apps/demo/examples/special/json.html
// use angular-ui bootstrap accordion and sortable
// TODO need to reduce this to a minimal handler for the content and make eveything happen in BookmarksService
angular.module('pekoeWorkspaceApp')
    .controller('BookmarksCtrl', ['$scope', '$http', 'BookmarksService', function ($scope, $http, BookmarksService) {
        // possibly make this a directive with a simple controller?
    // use 'this' instead of $scope. and use BookmarksCtrl as bk in the HTML
//        this.myUser = BookmarksService.getUser();
//        this.myTenant = BookmarksService.getTenant();
        this.list = BookmarksService.getBookmarks();
        var self = this;
        this.sortableOptions = {
            update: function(e, ui) { console.log('got update',e,ui, self.list); },
            axis: 'y',
            tolerance:'pointer',
            connectWith: '.bookmarks-container'
        }

        this.groupItems = [];

        // TODO make the Folders into Droppable so that when a Tab is dragged, it can be added to a list

        function addItem() {
            console.log('addItem called');
            if (!self.title || self.title === '') { return; }
            // TODO this needs to create a new "group" element and add it to the bookmarks list.
            // then, show the save button
            self.list.push({
                title: self.title,
                //content: self.content,
                collapsed: false
            });

            self.title = '';
            console.log("Bookmarks list modified: ",this.list);
        }


        function refreshBookmarks() { // clear bookmarks
            self.list = [];
//            self.myUser = BookmarksService.getUser();
//            self.myTenant = BookmarksService.getTenant();
            console.log('clearing bookmarks and setting new tenant');
        }

        $scope.$on('tenant.update',refreshBookmarks);
        $scope.$on('bookmarks.update',function () {
//            console.log('updating bookmarks');
            self.list = BookmarksService.getBookmarks();
            self.list[0].open = true;
//            console.log('List updated to ',self.list);
        });

        $scope.oneAtATime = false; // <accordion close-others="oneAtATime">

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

       this.addItem = addItem;

    }]);
