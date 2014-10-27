'use strict';

// SEE this example http://localhost/exist/apps/demo/examples/special/json.html
// use angular-ui bootstrap accordion and sortable
// TODO need to reduce this to a minimal handler for the content and make eveything happen in BookmarksService
angular.module('pekoeWorkspaceApp.bookmarks')
    .controller('BookmarksCtrl', ['$scope', '$http', 'BookmarksService', function ($scope, $http, BookmarksService) {

        this.bookmarks = BookmarksService.getBookmarks();
        this.list = this.bookmarks.group;
        var self = this;
        this.sortableOptions = {
            update: function(e, ui) { console.log('Sortable got update', self.list); },
            axis: 'y',
            tolerance:'pointer',
            connectWith: '.bookmarks-container'
        };

        function saveChanges() {
            $http.post('/exist/restxq/pekoe/user/bookmarks',this.bookmarks);
        }

//        this.groupItems = [];

        // TODO make the Folders into Droppable so that when a Tab is dragged, it can be added to a list

        function addGroup() {
            if (!self.title || self.title === '') { return; }
            // then, show the save button
            self.list.push({
                title: self.title,
                items : [{title:'placeholder', href:'', deleteMe:true, disabled:true}],
                open: true
            });
            self.title = ''; // reset form
        }


        function refreshBookmarks() { // clear bookmarks
            self.list = [];
            console.log('clearing bookmarks and setting new tenant');
        }

        $scope.$on('tenant.update',refreshBookmarks);
        $scope.$on('bookmarks.update',function () {
            self.bookmarks = BookmarksService.getBookmarks();
            self.list = self.bookmarks.groups;
            // need to fix the open/closed state. Only the first should be open
            angular.forEach(self.list, function (v){
                if (v.open) {delete v.open};
            });
            if (self.list[0]) {
                self.list[0].open = true;
            }
//            console.log('List updated to ',self.list);
        });

        $scope.oneAtATime = true; // <accordion close-others="oneAtATime">

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

       this.save = saveChanges;

       this.addGroup = addGroup;

    }]);
