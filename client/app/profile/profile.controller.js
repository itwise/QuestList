'use strict';

angular.module('questApp')
  .controller('ProfileCtrl', function ($scope, Auth, $http) {
    $scope.message = 'Hello';
    $scope.currentUser = Auth.getCurrentUser();

    $http.get('/api/quests').success(function(data){
      console.log(data);
      $scope.questTimelines = data;
    });
  });
