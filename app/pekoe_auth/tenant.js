'use strict';
// tenant selector for tenant.html
angular.module('pekoeWorkspaceApp.auth')
  .controller('TenantCtrl', ['AuthService',
//        '$location',
        function (AuthService) {
            console.log('About to ask for tenants');
        this.tenants = AuthService.getTenants();
        this.changeTenant = function (t) {
            AuthService.setTenant(t);
//            $location.path('/');
        };
  }]);
