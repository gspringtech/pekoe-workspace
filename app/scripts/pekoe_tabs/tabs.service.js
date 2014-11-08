'use strict';
/**
 * Created by alisterpillow on 27/10/2014.
 */
angular.module('pekoeWorkspaceApp.tabs')
    .service('TabsService', ['$rootScope', function ($rootScope) {

        var setAllInactive = function () {
            angular.forEach(service.tabs, function (td) {
                td.active = false;
            });
        };

        var tabIndex = function (item) {
            var exists = -1;
            angular.forEach(service.tabs, function (td, k) {
                console.log('COMPARE',td.title, item.title);
                if (td.href === item.href && td.title === item.title) {
                    exists = k;
                    return false;
                }
            });
            return exists;
        };

        var currentActive = function () {
            var current = -1;
            angular.forEach(service.tabs, function (td, k) {
                if (td.active) {
                    current = k;
                    return false; // probably unnecessary as this is such a small array.
                }
            });
            return current;
        };

        var service = {
            tabs: [],

            // Inactivate all tabs, add tab if not existing, activate if existing, refresh if active
            add: function (bookmark) {
                /*
                As I suspected, the 'bookmark' object is being used directly in the tab.
                So when the title is modified, so is the original bookmark. Not so useful.
                It also means that the test for .indexOf is looking for that same object - not doing any comparison
                So when I make a copy of the tab, the index function will break.

                 */
                var current = currentActive();
                console.log('ADD TAB funct');

                var tab = angular.copy(bookmark); // NOTE that if you supply a destination it will be updated. - is that useful?

//                tab.active = true;

                var tIndex = tabIndex(tab);
                console.log('tIndex',tIndex,'current',current);
                if (tIndex === -1) {
                    setAllInactive();
                    tab.active = true;
                    service.tabs.push(tab);
                    $rootScope.$broadcast('tabs.add'); // -------------------- broadcast tabs.add
                } else if (tIndex === current) {
                    console.log('reload this tab');
                    $rootScope.$broadcast('tabs.reload'); // ----------------- broadcast tabs.reload
                    // maybe this is handled by the tab control?
                    // how do I send a message to the iframe?
                    // Maybe it should be a directive with a controller - listening for messages.
                    // maybe its content should register with a service.
                } else {
                    this.tabs[tIndex].active = true;
                    // should cause a select
                }

            }
        };

        return service;
    }]);