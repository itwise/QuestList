'use strict';

angular.module('questApp')
  .controller('ProfileCtrl', function ($scope, Auth) {
    $scope.message = 'Hello';
    $scope.currentUser = Auth.getCurrentUser();
  });
