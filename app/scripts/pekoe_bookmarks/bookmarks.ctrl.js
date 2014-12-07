'use strict';

// TODO need to reduce this to a minimal handler for the content and make eveything happen in BookmarksService
// Getting rid of ng-controller might be the solution. Although I can't really see it.
angular.module('pekoeWorkspaceApp.bookmarks')
    .controller('BookmarksCtrl', ['$scope', '$http', 'BookmarksService', 'TabsService',
        function ($scope, $http, BookmarksService, TabsService) {
            // A LOT OF THIS PROBABLY BELONGS IN THE SERVICE
            this.editmode = false;
            this.bookmarks = BookmarksService.bookmarks();
            this.list = this.bookmarks.group;
            var self = this;
            this.sortableOptions = {
                axis: 'y',
                tolerance: 'pointer',
                disabled: true,
                connectWith: '.bookmarks-container'
            };
            this.revert = function () {
                this.cancelEdit();
                self.bookmarks = BookmarksService.loadBookmarks();
            };

            this.cancelEdit = function () {
                $scope.$emit('BOOKMARKS:EDIT:OFF');
                this.editmode = false;
                this.sortableOptions.disabled = true;
                $scope.oneAtATime = true;
            };

            this.edit = function () {
                self.editmode = true;
                $scope.$broadcast('BOOKMARKS:EDIT:ON');
                self.sortableOptions.disabled = false;
                $scope.oneAtATime = false;
            };

            function saveChanges() {
                self.cancelEdit();
                delete self.bookmarks.dirty;
                cleanUpList();
/// TODO THIS SHOULD BE IN THE SERVICE
                $http.post('/exist/restxq/pekoe/user/bookmarks', self.bookmarks).then(function () {
                    self.bookmarks.dirty = false;
                }, function (resp) {
                    console.warn('Problem saving bookmarks:', resp);
                });
            }
            // TODO new Group can't have items dragged into it from other Folders. Only from the Tabs.

            function addGroup() {
                if (!self.title || self.title === '') {
                    return;
                }
                self.list.push({
                    title: self.title,
                    items: [{title: 'placeholder', href: '', deleteMe: true, disabled: true}],
                    open: true
                });
                self.title = ''; // reset form

            }

            function refreshBookmarks() { // clear bookmarks
                self.list = [];
            }

            function cleanUpList() {
                angular.forEach(self.list, function (v) {
                    if (v.open) {
                        delete v.open;
                    }
                });
                if (self.list[0]) {
                    self.list[0].open = true;
                }
            }

            $scope.$on('tenant.update', refreshBookmarks); // auth.service broadcasts this after a tenant has been selected. (so user is logged in and has some tenants)
            $scope.$on('bookmarks.update', function () { // bookmarks service broadcasts this when bookmarks are received from server

                self.bookmarks = BookmarksService.bookmarks();
                self.list = self.bookmarks.groups;
                cleanUpList();
                // Open a Tab with the first item
                TabsService.add(self.list[0].items[0]); // LOAD A TAB USING THE FIRST BOOKMARK
            });

            $scope.oneAtATime = true; // <accordion close-others='oneAtATime'>

            this.save = saveChanges;

            this.addGroup = addGroup;

        }]);
