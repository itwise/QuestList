'use strict';

angular.module('questApp')
  .controller('ProfileCtrl', function ($scope, Auth, Quest, $stateParams, $http) {
    $scope.message = 'Hello';


    $scope.init = function(){
      if($stateParams.userId === 'me'){
        $scope.user = Auth.getCurrentUser();

        $http.get('/api/quests').success(function(data){
          console.log(data);
          $scope.questTimelines = data;

          $scope.nowProgressQuests = getProgressQuests();
        });
      }else{
        $http.get('/api/users/' + $stateParams.userId).success(function(profile){
          $scope.user = profile;
          console.log($scope.user);
        }).error(function(err){
          console.log(err);
        });

        Quest.getQuests({ id : $stateParams.userId }, function(quests){
          $scope.questTimelines = quests;

          $scope.nowProgressQuests = getProgressQuests();
        });

      }
    };

    $scope.nowProgressQuests = [];


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
