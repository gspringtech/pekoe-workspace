'use strict';

// SEE this example http://localhost/exist/apps/demo/examples/special/json.html
// use angular-ui bootstrap accordion and sortable
// TODO need to reduce this to a minimal handler for the content and make eveything happen in BookmarksService
// Getting rid of ng-controller might be the solution. Although I can't really see it.
angular.module('pekoeWorkspaceApp.bookmarks')
    .controller('BookmarksCtrl', ['$scope', '$http', 'BookmarksService', function ($scope, $http, BookmarksService) {
        this.editmode = false;
        this.bookmarks = BookmarksService.getBookmarks();
        this.list = this.bookmarks.group;
        var self = this;
        this.sortableOptions = {
            update: function() { console.log('Sortable got update', self.list); },
            axis: 'y',
            tolerance:'pointer',
            disabled: true,
            connectWith: '.bookmarks-container'
        };

        this.deleteMe = function (i) {
            console.log('this is ',this, 'and i is ',i);
        };

        this.cancelEdit = function () {

            this.editmode = false;
            this.sortableOptions.disabled = true;
            this.onAtATime = true;
        };

        this.edit = function () {
            self.editmode = true;
            console.log('edit bookmarks');
            self.sortableOptions.disabled = false;
            self.oneAtATime = false;
        };

        this.add = function (data) {
            console.log('bookmarks THIS.ADD',data);
//            BookmarksService.add() //     DON'T KNOW WHERE TO ADD IT. NEED TO PASS THE GROUP
//            self.editmode = true;
        };

        function saveChanges() {
            self.editmode = false;
            self.sortableOptions.disabled = true;
            self.oneAtATime = true;
            $http.post('/exist/restxq/pekoe/user/bookmarks',self.bookmarks);
        }


        function addGroup() {
            if (!self.title || self.title === '') { return; }
            console.log();
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
                if (v.open) {
                    delete v.open;
                }
            });
            if (self.list[0]) {
                self.list[0].open = true;
            }
//            console.log('List updated to ',self.list);
        });

        $scope.oneAtATime = true; // <accordion close-others='oneAtATime'>

        $scope.addItem = function() {
            console.log('bookmarks ctrl SCOPE.ADDITEM');
            var newItemNo = $scope.items.length + 1;
            $scope.items.push('Item ' + newItemNo);
        };

       this.save = saveChanges;

       this.addGroup = addGroup;

    }]);
