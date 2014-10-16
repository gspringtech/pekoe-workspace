'use strict';

describe('Service: TenantService', function () {

  // load the service's module
  beforeEach(module('pekoeWorkspaceApp'));

  // instantiate service
  var TenantService;
  beforeEach(inject(function (_TenantService_) {
    TenantService = _TenantService_;
  }));

  it('should do something', function () {
    expect(!!TenantService).toBe(true);
  });

});
