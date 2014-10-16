'use strict';

describe('Service: PrefsService', function () {

  // load the service's module
  beforeEach(module('pekoeWorkspaceApp'));

  // instantiate service
  var PrefsService;
  beforeEach(inject(function (_PrefsService_) {
    PrefsService = _PrefsService_;
  }));

  it('should do something', function () {
    expect(!!PrefsService).toBe(true);
  });

});
