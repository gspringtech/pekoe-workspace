'use strict';

describe('Filter: XmlAttr', function () {

  // load the filter's module
  beforeEach(module('pekoeWorkspaceApp'));

  // initialize a new instance of the filter before each test
  var XmlAttr;
  beforeEach(inject(function ($filter) {
    XmlAttr = $filter('XmlAttr');
  }));

  it('should return the input prefixed with "XmlAttr filter:"', function () {
    var text = 'angularjs';
    expect(XmlAttr(text)).toBe('XmlAttr filter: ' + text);
  });

});
