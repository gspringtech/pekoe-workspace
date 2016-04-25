/**
 * Created by alisterpillow on 25/10/2014.
 *
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

// FRAMES with angular - useful answer here: http://stackoverflow.com/questions/18437594/angularjs-call-other-scope-which-in-iframe

angular.module('pekoeWorkspaceApp.tabs')
    .controller('TabsCtrl', ['TabsService', '$scope','BookmarksService', function (TabsService, $scope, BookmarksService) {
        // http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular/
        // thanks to http://odetocode.com/blogs/scott/archive/2013/08/14/dynamic-tabs-with-angularjs-and-ui-bootstrap.aspx
        //console.log('in tabs ctrl');
        // Need to remove $scope and replace with 'this'
        // Also, send everything to TabsService
        $scope.tabs = TabsService.tabs;
//
//        });
        $scope.activate = function (t) { // the tab is the {title, href, type}
            //console.log('tabs.ctr reactivate',t);
            //console.log(t.frame)
            //TabsService.reActivate(t);

            // the tabs service reActivate method will set reloading to true (to prevent a second call)
            // the frame directive will set this to false after the frame is loaded
            if (!t.reloading) {
                //console.log('tabs.ctr reactivate',t);
                TabsService.reActivate(t);
            }
            //else { console.log('Not reactivating');}

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
            return false; // don't let ui.bootstrap.tabs handle the close - do it in my service
        };
    }]);
