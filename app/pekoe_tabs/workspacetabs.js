'use strict';
// The problem with this controller is that you can't give it methods - so you can't add to the data
// Instead, I need a service which can be updated by other components.
// When a tab is opened or closed, the Service will broadcast a message
// FRAMES with angular - useful answer here: http://stackoverflow.com/questions/18437594/angularjs-call-other-scope-which-in-iframe

angular.module('pekoeWorkspaceApp.tabs')
  .controller('WorkspacetabsCtrl', ['BookmarksService','$scope', function (BookmarksService, $scope) {

        // thanks to http://odetocode.com/blogs/scott/archive/2013/08/14/dynamic-tabs-with-angularjs-and-ui-bootstrap.aspx
    var setAllInactive = function() {
            angular.forEach($scope.tabsData, function(td) {
                td.active = false;
            });
        };

    $scope.tabsData = [
//        {
//            title:'Welcome',
//            content:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit mafiosa',
//            href: '/exist/restxq/pekoe/welcome',
//            active: true
//        }
//        ,
//        {
//            title:'Files',
//            content:'List of files in an iframe',
//            href: '/exist/restxq/pekoe/tenant/' + tenant + '/browse',
//            active: false
//        }
    ];
    $scope.addTab = function (title,href) {
        setAllInactive();
        var id = $scope.tabsData.length + 1;
        $scope.tabsData.push({
            id: id,
            name: title,
            href: href,
            active: true
        });
    };
        window.mytabs = $scope;
  }]);
