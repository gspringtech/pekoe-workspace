'use strict';
// tenant selector for tenant.html
angular.module('pekoeWorkspaceApp.auth')
  .controller('TenantCtrl', ['AuthService', function (AuthService) {
        this.tenants = AuthService.getTenants();
        this.changeTenant = function (t) {
            AuthService.setTenant(t);
        };
  }]);
