'use strict';

angular.module('pekoeWorkspaceApp.bookmarks')
  .controller('BookmarksitemCtrl', ['$scope','TabsService', function ($scope, TabsService) {
        // use BookmarksitemCtrl as bki
        // and then use this. to hide non-essential scope parts
//   console.log('scope' ,$scope);
        /*
        currently in scope:
        group [Object]
        item <group>
        ngModel [Object[<group>,<group>]
        panelBaseId "collapse-panel-body"
        panelId     "collapse-panel"
        subitem <item>

         */

        this.click = function (){
            TabsService.add(this);
        }
        var myItem = angular.element($scope.subitem);
//        console.log('bookmarksItemCtrl my item is',myItem)
        this.title = myItem.attr('title');
        this.href = myItem.attr('href');
  }]);

angular.module('pekoeWorkspaceApp.bookmarks')
    .controller('BookmarksGroupCtrl', ['$scope', function ($scope) {
        // use BookmarksitemCtrl as bki
        // and then use this. to hide non-essential scope parts
        // in $scope:
        // bgc=BookmarksGroupCtrl, bc=BookmarksCtrl, group, oneAtATime
        // bgc is this controller
//   console.log('scope' ,$scope); // as above
        var self = this;
        this.sortableOptions = {
            update: function(e, ui) { console.log('BGC got update',e,ui, $scope.items); },
            axis: 'y',
            tolerance:'pointer',
            connectWith: '.bookmarks-container'
        }
        // Okay - the order of this list is being changed by sorting, but it's not changing the XML
        // So either I must mimic the xml completely, or store and use JSON.
        // That would certainly be easier I think.
//        this.items = angular.element($scope.group).children('item');
//        console.log("ITEMS IN THIS GROUP:",this.items);

    }]);