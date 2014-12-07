'use strict';

// FRAMES with angular - useful answer here: http://stackoverflow.com/questions/18437594/angularjs-call-other-scope-which-in-iframe

angular.module('pekoeWorkspaceApp.tabs')
    .controller('TabsCtrl', ['TabsService', '$scope','BookmarksService', function (TabsService, $scope, BookmarksService) {
        // http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular/
        // thanks to http://odetocode.com/blogs/scott/archive/2013/08/14/dynamic-tabs-with-angularjs-and-ui-bootstrap.aspx
        console.log('in tabs ctrl');
        // Need to remove $scope and replace with 'this'
        // Also, send everything to TabsService
        $scope.tabs = TabsService.tabs;
//
//        });
        $scope.activate = function (t) { // the tab is the {title, href, type}
            TabsService.reActivate(t);
            //console.log('GOT ACTIVATE ON ', t.title); // activate is called on initial load. I got 3 events for the second tab
            // so the FORM and the LIST are calling this method twice. Why?
        };

        $scope.bookmark = function () {
            var tab = TabsService.active();
            BookmarksService.addToCurrentGroup(tab);
            $scope.apply();
        };


        // this can be called by the content of the iframe!!
        $scope.addTab = function (t){
            TabsService.add(t);
            $scope.$apply(); // otherwise a tab added by the frame won't appear.
        };

        $scope.removeTab = function (index) {
            TabsService.closeTab(index);
        };
    }]);
