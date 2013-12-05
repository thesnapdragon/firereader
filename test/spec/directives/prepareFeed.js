'use strict';

describe('Directive: prepareFeed', function () {

  // load the directive's module
  beforeEach(module('firereaderApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<link-target-blank></link-target-blank>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the prepareFeed directive');
  }));
});
