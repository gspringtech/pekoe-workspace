'use strict';

angular.module('pekoeWorkspaceApp')
  .controller('BookmarksitemCtrl', ['$scope', function ($scope) {
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
        var myItem = angular.element($scope.subitem);
        this.title = myItem.attr('title');
        this.href = myItem.attr('href');
  }]);
