'use strict';

angular.module('questApp')
  .controller('FriendCtrl', function ($scope, Auth, $http) {
    $scope.message = 'Hello';

    $scope.currentUser = Auth.getCurrentUser();
    console.log($scope.currentUser);


  });
