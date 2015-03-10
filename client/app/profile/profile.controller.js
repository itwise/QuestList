'use strict';

angular.module('questApp')
  .controller('ProfileCtrl', function ($scope, Auth, Quest, $stateParams, $http, Notifier, $window) {
    $scope.message = 'Hello';
    $scope.currentUser = Auth.getCurrentUser();


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

    $scope.addQuest = function(quest){
      if(quest === undefined || quest.title === undefined
        || quest.content === undefined || quest.title === "" || quest.content === "" ){
        Notifier.message("내용을 입력해 주세요");
        return;
      }
      var splitTagList;
      if(quest.tags !== undefined){
        splitTagList = quest.tags.split('#');
        if(splitTagList.length <= 1) {
          Notifier.message("Not found '#'");
          return;
        }
        splitTagList.shift();
        quest.tags = splitTagList;
      }
      Quest.createQuest(quest, function(data){
        Notifier.message('quest가 등록 되었습니다.', function(){
          $window.location.reload();
        });
      });
    };

  });
