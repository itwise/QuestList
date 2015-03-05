'use strict';
angular.module('questApp')
  .controller('MainCtrl', function ($scope, Auth, $window, Quest, Notifier) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.questTimelines = [];
    $scope.nowProgressQuests = [];

    Quest.getQuests({ id : $scope.currentUser._id}, function(questList){
      $scope.questTimelines = questList;
      for(var i = 0; i < $scope.currentUser.friends.length; i++){
        Quest.getQuests({ id : $scope.currentUser.friends[i]._id}, function(questList){
          $scope.questTimelines = $scope.questTimelines.concat(questList);
          $scope.questTimelines.sort(function(rec, past){ //timeline 정령 최신
            var a = new Date(past.startDate);
            var b = new Date(rec.startDate);
            return a - b;
          });
          console.log($scope.questTimelines);
        });
      }
      $scope.nowProgressQuests = getProgressQuests();
    });
    console.log($scope.currentUser);
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
    $scope.processibleQuests = [
    ];
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
    $scope.getConnectingWord = function(word){
      var code = word.charCodeAt(word.length-1) - 44032;
      // 원본 문구가 없을때는 빈 문자열 반환
      if (word.length == 0) return '';
      // 한글이 아닐때
      if (code < 0 || code > 11171) {
        return '';
      }
      if (code % 28 == 0) {
        return '를';
      }else {
        return '을'
      }
    };
  });
