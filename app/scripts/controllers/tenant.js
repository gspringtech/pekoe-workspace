'use strict';
// tenant selector for tenant.html
angular.module('pekoeWorkspaceApp')
  .controller('TenantCtrl', ['PrefsService',
//        '$location',
        function (PrefsService) {
        this.tenants = PrefsService.getTenants();
        this.changeTenant = function (t) {
            PrefsService.setTenant(t);
//            $location.path('/');
        };
  }]);
