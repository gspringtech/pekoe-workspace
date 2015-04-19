'use strict';
/**
 * Created by alisterpillow on 27/10/2014.
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
angular.module('pekoeWorkspaceApp.tabs')
    .service('TabsService', ['$rootScope','$timeout', function ($rootScope,$timeout) {
        var myService = {};
        var setAllInactive = function () {
            angular.forEach(myService.tabs, function (td) {
                td.active = false;
            });
        };

        var tabIndex = function (item) {
            var exists = -1;
            angular.forEach(myService.tabs, function (td, k) {
                if (td.title === item.title) {
                    exists = k;
                    return false;
                }
            });
            return exists;
        };

        var currentActive = function () {
            var current = -1;
            angular.forEach(myService.tabs, function (td, k) {
                if (td.active) {
                    current = k;
                    return false; // probably unnecessary as this is such a small array.
                }
            });
            return current;
        };
        myService.active = function () {
            return myService.tabs[currentActive()];
        };

        myService.tabs = [];

       // manage the iframe content
        myService.manage = function (tab, frameWindow) {
            if (tab.type === 'form'){ // FORM windows need to have a chance to clean up...
                var tabCloser = function () { // This will be called by the Form window
                    // myService.closeTab(tabIndex(tab)); CIRCULAR!
                    myService.tabs.splice(tabIndex(tab), 1);
                    var pre = myService.tabs[tab.openedBy];
                    if (pre) {pre.active = true;}
                    $rootScope.$apply();    
                };
                frameWindow.readyToClose = tabCloser;
            }
            tab.frameWindow = frameWindow;
        };

        /*
        What should happen when the active tab is closed?
        Option 1 - default: "If this is the last tab, select the previous tab. else, the next tab." (angular ui-bootstrap)
        Option 2 - go to the previously active tab (maintain a stack of open tabs)
        Option 3 - go to the tab that opened this one, else Option 1 or Option 2
        To make this work, I might need to change ui-bootstrap.
         */
        // The tabs.ctrl .remove method will call this
        myService.closeTab = function (index) { // this index is simply the array index. It changes whenever a tab is closed
            var tab = myService.tabs[index];
            var prevTab = tab.openedBy;
            console.log('want to reactivate',prevTab);

            try {
                if (tab.type === 'form' && tab.frameWindow && tab.frameWindow.pekoeClose) {
                    // need to cancel at this point.
                    $timeout(function () {
                        tab.frameWindow.pekoeClose();
                    });
                    return false;
                } else { // just close it
                    myService.tabs.splice(index, 1);
                }
            } catch (e) {
                //myService.tabs.splice(index,1); // is this sensible?
                console.warn('ERROR when trying to CLOSE A MANAGED TAB', e);
            }

            if (prevTab) {
                var pre = myService.tabs[prevTab];
                if (pre) {pre.active = true;}
            }

        };
        // tabs.ctrl will call this on select
        myService.reActivate = function (tab) {
            // I'm getting this message when the tab is first added
            // and when you switch back to it
            // BUT NOT WHEN it's already Active - only the RELOAD below
            if (tab.type !== 'form') {
                if (tab.frameWindow && tab.frameWindow.location) {
                    tab.frameWindow.location.reload(); // this is really a 'refresh'.
                    console.log('reActivate', tab.title);
                   // tab.active = true;
                } else {
                    //tab.active = true;
                }
            }
        };

        // Inactivate all tabs, add tab if not existing, activate and refresh if existing and, reload the tab from the bookmark if it is currently active
        // this should not use broadcast
        myService.add = function (bookmark) {
            //console.log('you asked to add',bookmark.href);
            try {
                var newTab = angular.copy(bookmark); // Don't want to modify the original bookmark.
                var current = currentActive(); // index of currently active tab.

                var tIndex = tabIndex(newTab); // is this tab already loaded? Based on TITLE now.
                setAllInactive();
                var tab;
                if (tIndex === -1) { // Not found so Add NEW tab
                    //console.log('... as NEW tab');
                    newTab.active = true;
                    newTab.openedBy = current;
                    myService.tabs.push(newTab);
                } else if (tIndex === current) { // is the current tab so Reload
                    //console.log('... RELOAD TAB from original');
                    tab = myService.tabs[tIndex];

                    if (tab.type !== 'form') {
                        tab.href = bookmark.href;
                        if (tab.frameWindow){
                            tab.frameWindow.location = bookmark.href; // This will revert it to the original
                        }

                    }
                    tab.active = true;
                } else { // found but not current,
                    //console.log('... REFRESH TAB');
                    tab = myService.tabs[tIndex];
                    tab.active = true;

                    //var tab = myService.tabs[tIndex];
                    //tab.frameWindow.location = tab.href;
                    //tab.active = true;
                }
            } catch (e) {console.warn('tab service add error',e);}
        };

        return myService;
    }]);
//
//angular.module('ui.bootstrap.tabs').config(function ($provide){
//    $provide.decorator('tabsDirective',function ($delegate){
//        var directive = $delegate[0];
//        console.log('got directive',directive);
//        return $delegate;
//    });
//
//});
//angular.module('pekoeWorkspaceApp.tabs').directive('tabset',function() {
//    console.log('contsrurting my tabs');
//    return {
//
//        controller: function () {
//            //this.data = {};
//            this.remove = function (e) {
//                console.log('got e', e);
//            };
//        },
//        link : function(scope,iel,iAttr) {
//            console.log('got scope',scope,'iel',iel,'iAttr',iAttr);
//        }
//};
//});
