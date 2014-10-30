'use strict';

describe('Directive: draggableTab', function () {

  // load the directive's module
  beforeEach(module('pekoeWorkspaceApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<draggable-tab></draggable-tab>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the draggableTab directive');
  }));
});
