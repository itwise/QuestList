'use strict';

describe('Controller: QuesttimelineCtrl', function () {

  // load the controller's module
  beforeEach(module('questApp'));

  var QuesttimelineCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuesttimelineCtrl = $controller('QuesttimelineCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
