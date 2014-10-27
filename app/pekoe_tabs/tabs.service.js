/**
 * Created by alisterpillow on 27/10/2014.
 */
angular.module('pekoeWorkspaceApp.tabs')
    .service('TabsService', ['$rootScope', function ($rootScope) {
        var service = {
            tabs: [
//                {
//                    title:'Welcome',
//                    content:'Lorem ipsum dolor sit amet, consectetuer adipiscing elit mafiosa',
//                    href: '/exist/restxq/pekoe/welcome',
//                    active: true
//                }

            ],

            add: function (tab) {
                service.tabs.push(tab);
                $rootScope.$broadcast('tabs.update');
            }
        }

        return service;
    }]);