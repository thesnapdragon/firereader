'use strict';

describe('Filter: subscriptionname', function () {

  // load the filter's module
  beforeEach(module('firereaderApp'));

  // initialize a new instance of the filter before each test
  var subscriptionname;
  beforeEach(inject(function ($filter) {
    subscriptionname = $filter('subscriptionname');
  }));

  it('should return the input prefixed with "subscriptionname filter:"', function () {
    var text = 'angularjs';
    expect(subscriptionname(text)).toBe('subscriptionname filter: ' + text);
  });

});
