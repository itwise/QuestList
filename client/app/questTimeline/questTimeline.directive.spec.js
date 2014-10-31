'use strict';

describe('Directive: questTimeline', function () {

  // load the directive's module and view
  beforeEach(module('todoListApp'));
  beforeEach(module('app/questTimeline/questTimeline.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<quest-timeline></quest-timeline>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the questTimeline directive');
  }));
});