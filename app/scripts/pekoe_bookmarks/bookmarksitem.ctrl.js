'use strict';

angular.module('pekoeWorkspaceApp.bookmarks')
  .controller('BookmarksitemCtrl', ['$scope','TabsService', function ($scope, TabsService) {
        this.click = function (){
            TabsService.add($scope.subitem);
        };
  }]);

angular.module('pekoeWorkspaceApp.bookmarks')
    .controller('BookmarksGroupCtrl', ['$scope', function ($scope) {
        // use BookmarksitemCtrl as bki
        // and then use this. to hide non-essential scope parts
        // in $scope:
        // bgc=BookmarksGroupCtrl, bc=BookmarksCtrl, group, oneAtATime
        // bgc is this controller
//   console.log('scope' ,$scope); // as above
//        var self = this;
        this.sortableOptions = {
            update: function(e, ui) { console.log('BGC got update',e,ui, $scope.items); },
            axis: 'y',
            tolerance:'pointer',
            disabled: !this.editmode,
            connectWith: '.bookmarks-container'
        };
        this.add = function(tab) {
            // TODO - rethink this test. Probably want to check the href of the tab.
            // Then offer the user the option to change the name if the same.
            if (!tab.title || tab.title === '') { return; }
            var items = $scope.group.items;
            var inList = false;
            for (var i in items) {
                if (items[i].href === tab.href) {
                    inList = true;
                    break;
                }
            }
            if (inList) {
                console.log('Bookmarks already contanis this item');
                return;
            }

            $scope.group.items.push(tab);
            $scope.$apply();
        };
        // Okay - the order of this list is being changed by sorting, but it's not changing the XML
        // So either I must mimic the xml completely, or store and use JSON.
        // That would certainly be easier I think.
//        this.items = angular.element($scope.group).children('item');
//        console.log("ITEMS IN THIS GROUP:",this.items);

    }]);