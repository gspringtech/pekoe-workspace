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
            add: function (tab) {
                var current = currentActive();
                setAllInactive();
                tab.active = true;
                var tIndex = service.tabs.indexOf(tab);
                if (tIndex === -1) {
                    service.tabs.push(tab);
                } else {
                    if (tIndex === current) {
                        console.log('refresh this tab');
                        // maybe this is handled by the tab control?
                        // how do I send a message to the iframe?
                        // Maybe it should be a directive with a controller - listening for messages.
                        // maybe its content should register with a service.
                    }
                }
                $rootScope.$broadcast('tabs.update');
            }
        };

        return service;
    }]);