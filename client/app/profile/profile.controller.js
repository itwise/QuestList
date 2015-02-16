'use strict';

angular.module('questApp')
  .controller('ProfileCtrl', function ($scope, Auth, $http) {
    $scope.message = 'Hello';
    $scope.currentUser = Auth.getCurrentUser();

    $scope.nowProgressQuests = [];

    $http.get('/api/quests').success(function(data){
      console.log(data);
      $scope.questTimelines = data;

      $scope.nowProgressQuests = getProgressQuests();
    });


    var getProgressQuests = function(){
      var nowProgressQuestList = [];

      $scope.questTimelines.forEach(function(quest){
        if(quest.status === 'START'){
          nowProgressQuestList.push(quest);
        }
      });

      console.log(nowProgressQuestList);

      return nowProgressQuestList;
    };
  });
