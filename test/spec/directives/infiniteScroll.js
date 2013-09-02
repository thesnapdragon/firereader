'use strict';

describe('Directive: infiniteScroll', function () {
  beforeEach(module('firereaderApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<infinite-scroll></infinite-scroll>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the infiniteScroll directive');
  }));
});
