'use strict';

describe('Controller: BookmarksitemCtrl', function () {

  // load the controller's module
  beforeEach(module('pekoeWorkspaceApp'));

  var BookmarksitemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookmarksitemCtrl = $controller('BookmarksitemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
