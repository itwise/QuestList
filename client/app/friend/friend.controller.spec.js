'use strict';

describe('Controller: FriendCtrl', function () {

  // load the controller's module
  beforeEach(module('questApp'));

  var FriendCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FriendCtrl = $controller('FriendCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
