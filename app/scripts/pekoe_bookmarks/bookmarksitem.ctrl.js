'use strict';

angular.module('pekoeWorkspaceApp.bookmarks')
  .controller('BookmarksitemCtrl', ['$scope','TabsService', function ($scope, TabsService) {
        this.click = function (){
            TabsService.add($scope.subitem);
        };
  }]);

