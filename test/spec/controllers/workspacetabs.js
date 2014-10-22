'use strict';

describe('Controller: WorkspacetabsCtrl', function () {

  // load the controller's module
  beforeEach(module('pekoeWorkspaceApp'));

  var WorkspacetabsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WorkspacetabsCtrl = $controller('WorkspacetabsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
