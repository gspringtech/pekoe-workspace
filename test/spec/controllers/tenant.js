'use strict';

describe('Controller: TenantctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('pekoeWorkspaceApp'));

  var TenantctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TenantctrlCtrl = $controller('TenantctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
