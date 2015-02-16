'use strict';

angular.module('questApp')
  .controller('MainCtrl', function ($scope, Auth, $window, Quest) {

    $scope.nowProgressQuests = [];

    Quest.getQuestList(function(questList){
      $scope.questTimelines = questList;

      $scope.nowProgressQuests = getProgressQuests();
    });

    console.log(Quest.getQuestList());

    $scope.currentUser = Auth.getCurrentUser();

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
        alert("내용을 입력해 주세요");
        return;
      }
      var splitTagList;
      if(quest.tags !== undefined){
        splitTagList = quest.tags.split('#');

        if(splitTagList.length <= 1) {
          alert("Not found '#'");
          return;
        }

        splitTagList.shift();

        quest.tags = splitTagList;
      }

      Quest.createQuest(quest, function(data){
        $window.location.reload();
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
