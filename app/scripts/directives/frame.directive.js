/**
 * Created by alisterpillow on 4/11/2014.
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
angular.module('pekoeWorkspaceApp')
    .directive('pekoeFrame', function ($rootScope, TabsService  ) { // always remember to camelCase the name otherwise the directive won't work.
        return {
            restrict: 'E',
            template: '<iframe ng-src="{{tab | tabUrl}}" class="pekoeFrame"></iframe>',
            controller: function ($element,$scope){
                //console.log('frame contrller element',$element,'$scope',$scope);
                $element.get(0).onload = function (e){
//                    console.log('FRAME IS LOADED',e);
                    $scope.frameLoaded = true;
                    var fr = e.target.contentWindow;
                    TabsService.manage($scope.tab, fr);
                    //if (fr.location.pathname === '/exist/restxq/login') {
                    //    $scope.$emit('event:auth-loginRequired');
                    //}
                    //else { // Don't do this - it's confusing
                    //    // Change the name and href of the tab so that it can be bookmarked.
                    //    var fullpath = fr.document.location.pathname + fr.document.location.search;
                    //    if ($scope.tab.href !== fullpath) {
                    //        console.log('updating tab data');
                    //        $scope.tab.title = fr.document.title;
                    //        $scope.tab.href = fullpath;
                    //        //$scope.$apply();
                    //    }
                    //}
                };
            },
            replace: true,

            link: function() {
                // TODO  I NEED TO BE ABLE TO CALL _THIS_ TAB DIRECTLY
                // TODO These frame directives are ALL STILL LISTENING EVEN AFTER BEING DESTROYED
                // WHICH means that I MUST turn OFF any listeners I turn ON
                // to turn off an event, call the returned function
                //var off = $rootScope.$on();
                //off();
                // this is supposed to happen when the Tab is activated
                //$rootScope.$on('tabs.refresh',function (){ // refresh is broadcast by the tabs.ctrl when the tab select function is called
                //    if (scope.frameLoaded && scope.tab.active) {
                //        console.log('REFRESH TAB',scope.tab.title);
                //        var frame = angular.element('.tab-pane.active iframe');
                //        if (frame.length && frame.get && frame.get(0)) {
                //            console.log('reload it');
                //            frame.get(0).contentWindow.location.reload();
                //        }
                //
                //    }
                //});
                //$rootScope.$on('TABS.RELOAD',function (){
                //    if (scope.tab.active) {
                //        console.log('RELOAD TAB',scope.tab.title); // Yes
                //        angular.element('.tab-pane.active iframe').get(0).contentWindow.location = scope.tab.href;
                //    }
                //});
            }
        };
    });
