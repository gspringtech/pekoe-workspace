'use strict';
// tenant selector for tenant.html
angular.module('pekoeWorkspaceApp')
  .controller('TenantCtrl', ['PrefsService', function (PrefsService) {
        this.tenants = PrefsService.getTenants();
        this.changeTenant = function (t) {
            console.log('TenantCtrl t is ',t);
            PrefsService.setTenant(t);
        };
  }]);
