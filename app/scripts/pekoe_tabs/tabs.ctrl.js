'use strict';

// FRAMES with angular - useful answer here: http://stackoverflow.com/questions/18437594/angularjs-call-other-scope-which-in-iframe

angular.module('pekoeWorkspaceApp.tabs')
    .controller('TabsCtrl', ['TabsService', '$scope', function (TabsService, $scope) {
        // http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular/
        // thanks to http://odetocode.com/blogs/scott/archive/2013/08/14/dynamic-tabs-with-angularjs-and-ui-bootstrap.aspx

        // $('iframe').width($('#work-area').width()-4)

        $scope.$on('tabs.update', function () {
            console.log('tabs update');
            $scope.tabs = TabsService.tabs;

        });
        // How can I send a message to the IFRAME?
        $scope.tabs = TabsService.tabs;

    }]);
