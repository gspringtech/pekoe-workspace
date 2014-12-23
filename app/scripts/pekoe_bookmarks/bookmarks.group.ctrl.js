/**
 * Created by alisterpillow on 16/11/2014.
 *  *
 * Pekoe Workspace provides a wrapper for the Pekoe Job Manager
 * Copyright (C) 2009,2010,2011-2014 Geordie Springfield Pty Ltd (Australia)
 * Author: Alister Pillow alisterhp@me.com

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */
'use strict';

angular.module('pekoeWorkspaceApp.bookmarks')
    .controller('BookmarksGroupCtrl', ['$scope', function ($scope) {
        var self = this;

        self.itemCheck = function () {
            console.log('ITEM CHECK', $scope.group.items.length);
            if ($scope.group.items.length === 0) {
                var bookmarkGroups = $scope.bc.bookmarks.groups;
                if (bookmarkGroups.length > 1) {
                    if (window.confirm('Remove Bookmarks group ' + $scope.group.title + '?')) {
                        bookmarkGroups.splice(bookmarkGroups.indexOf($scope.group), 1);
                    } else { // will need a placeholder
                        $scope.group.items.push({title: 'placeholder', href: '', deleteMe: true, type:'placeholder', disabled: true});
                    }
                }
            }
        };

        // HOW DO I GET THE SENDER OF THE BOOKMARK? THE ORIGINAL GROUP. WHY IS SENDER = NULL?
        this.sortableOptions = {
            update: function () {
                var items = $scope.group.items;
                for (var i in items) {
                    if (items[i].deleteMe) {
                        items.splice(i, 1); // seems a bit risky doing this in a loop.
                        break;
                    }
                }
            },
            remove: function () {
                console.log('GOT REMOVE EVENT ');
                self.itemCheck();
            },
            axis: 'y',
            tolerance: 'pointer',
            disabled: !this.editmode,
            connectWith: '.bookmarks-container'
        };
// This is probably not so good - manipulating the data structure down here in the directive.
        this.deleteMe = function (index) {
            // BookmarksService.remove(group, index); Should do this. !!!!
            $scope.group.items.splice(index, 1); // Delete the item
            $scope.bc.bookmarks.dirty = true;
            // if there are no items left, ask the user whether to delete the group as well (as long as there's at least one group left).
            self.itemCheck();
        };

        $scope.$on('BOOKMARKS:EDIT:ON', function () {
            //console.log('bookmarks editable on group');
            self.sortableOptions.disabled = false;
        });
        $scope.$on('BOOKMARKS:EDIT:OFF', function () {
            self.sortableOptions.disabled = true;
        });
        // this also should be in the service
        this.add = function (tab) {
            // TODO - rethink this test. Probably want to check the href of the tab.
            // Then offer the user the option to change the name if the same.
            if (!tab.title || tab.title === '') {
                return;
            }
            var items = $scope.group.items;
            var inList = false;
            for (var i in items) {
                if (items[i].href === tab.href) {
                    inList = true;
                    break;
                }
            }
            if (inList) {
                console.log('Bookmarks already contains this item');
                return;
            }
            // going to add a new bookmark
            $scope.bc.bookmarks.dirty = true;
            $scope.group.items.push(tab);

            for (var j in items) {
                if (items[j].deleteMe) {
                    $scope.group.items.splice(j, 1); // seems a bit risky doing this in a loop.
                    break;
                }
            }
            //if ($scope.group.items[0].title === 'placeholder') {
            //  $scope.group.items.splice(0,1);
            //}
            $scope.$apply();
        };

    }]);
