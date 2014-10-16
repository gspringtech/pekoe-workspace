'use strict';

// SEE this example http://localhost/exist/apps/demo/examples/special/json.html
// see also http://subliminalsources.com/81/angularjs-ui-component-directives/ and for Tabs too.

angular.module('pekoeWorkspaceApp')
    .controller('BookmarksCtrl', ['$scope', '$http', 'PrefsService', function ($scope, $http, PrefsService) {
    // use 'this' instead of $scope. and use BookmarksCtrl as bk in the HTML
        this.myUser = PrefsService.getUser();
        this.myTenant = PrefsService.getTenant();
        this.list = PrefsService.getBookmarks();
        var self = this;


//        this.changeTenant = function(myTenant){
//            console.log('tenant changed to',myTenant);
//            if (myTenant.length > 1 ) {
//                TenantService.setTenant(myTenant);
//                loadBookmarks();
//
//            }
//        };

        function refreshBookmarks() {
            self.list = [];
            self.myUser = PrefsService.getUser();
            self.myTenant = PrefsService.getTenant();
            console.log('clearing bookmarks and setting new tenant:',self.myTenant);
        }

        $scope.$on('tenant.update',refreshBookmarks);
        $scope.$on('bookmarks.update',function () {
            console.log('updating bookmarks');
            self.list = PrefsService.getBookmarks();
        });

        this.selectedItem = {};

        this.options = {
        };

        this.remove = function (scope) {
            scope.remove();
        };

        this.toggle = function (scope) {
            scope.toggle();
        };

        this.newSubItem = function (scope) {
            var nodeData = scope.$modelValue;
            nodeData.items.push({
                id: nodeData.id * 10 + nodeData.items.length,
                title: nodeData.title + '.' + (nodeData.items.length + 1),
                items: []
            });
        };
    }]);
