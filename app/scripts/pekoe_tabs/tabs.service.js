'use strict';
/**
 * Created by alisterpillow on 27/10/2014.
 */
angular.module('pekoeWorkspaceApp.tabs')
    .service('TabsService', ['$rootScope', function ($rootScope) {
        var myService = {};
        var setAllInactive = function () {
            angular.forEach(myService.tabs, function (td) {
                td.active = false;
            });
        };

        var tabIndex = function (item) {
            var exists = -1;
            angular.forEach(myService.tabs, function (td, k) {
                if (td.href === item.href && td.title === item.title) {
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
                    myService.tabs.splice(tabIndex(tab), 1);
                    $rootScope.$apply();
                };
                frameWindow.readyToClose = tabCloser;
            }
            tab.frameWindow = frameWindow;
        };

        // The tabs.ctrl .remove method will call this
        myService.closeTab = function (index) { // this index is simply the array index. It changes whenever a tab is closed
            var tab = myService.tabs[index];
            try {
                if (tab.type === 'form' && tab.frameWindow && tab.frameWindow.pekoeClose) {
                    tab.frameWindow.pekoeClose();
                } else { // just close it
                    myService.tabs.splice(index, 1);
                }
            } catch (e) {
                myService.tabs.splice(index,1); // is this sensible?
                console.warn('ERROR when trying to CLOSE A MANAGED TAB', e);
            }
        };
        // tabs.ctrl will call this on select
        myService.reActivate = function (tab) {
            // I'm getting this message when the tab is first added
            // and when you switch back to it
            // BUT NOT WHEN it's already Active - only the RELOAD below
            if (tab.type !== 'form') {
                if (tab.frameWindow) {
                    tab.frameWindow.location.reload(); // this is really a 'refresh'.
                    console.log('reActivate', tab.title);
                    tab.active = true;
                }
                else tab.active = true;
            }
        };

        // Inactivate all tabs, add tab if not existing, activate and refresh if existing and, reload the tab from the bookmark if it is currently active
        // this should not use broadcast
        myService.add = function (bookmark) {
            console.log('ADD',bookmark.href);
            try {
                var newTab = angular.copy(bookmark); // Don't want to modify the original bookmark.
                var current = currentActive(); // index of currently active tab.

                var tIndex = tabIndex(newTab); // is this tab already loaded?
                //console.log('tIndex',tIndex, ' and current',current);
                setAllInactive();
                if (tIndex === -1) { // Not found so Add NEW tab
                    console.log('... as NEW tab');
                    newTab.active = true;
                    myService.tabs.push(newTab);
                } else if (tIndex === current) { // is the current tab so Reload
                    console.log('... RELOAD TAB');
                    var tab = myService.tabs[tIndex];
                    if (tab.type !== 'form') {
                        tab.frameWindow.location = tab.href;
                    }
                    tab.active = true;
                } else { // found but not current,
                    var tab = myService.tabs[tIndex];
                    tab.active = true;
                    console.log('... REFRESH TAB');
                    //var tab = myService.tabs[tIndex];
                    //tab.frameWindow.location = tab.href;
                    //tab.active = true;
                }
            } catch (e) {console.warn('tab service add error',e);}
        };

        return myService;
    }]);
