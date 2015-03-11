'use strict';
angular.module('questApp')
  .controller('MainCtrl', function ($scope, Auth, $window, Quest, Notifier, $http) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.questTimelines = [];
    $scope.nowProgressQuests = [];
    $scope.processibleQuests = [];
    $scope.questPoolRank = [];

    /**
     * 나 + 친구들의 Quest 조회
     */
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


    /**
     * 현재 진행중인 퀘스트 가져오기
     * @returns {Array}
     */
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


    /**
     * 퀘스트 수행랭킹 조회
     */
    $http.get('/api/questPools').success(function(questPool){
      $scope.questPoolRank = questPool;
      console.log($scope.questPoolRank);
    }).error(function(err){
      console.log(err);
    });

    /**
     * quest 작성
     * @param quest
     */
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


    /**
     * 을/를 구분
     * @param word
     * @returns {string}
     */
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

    /**
     * 수행랭킹의 퀘스트 선택시 퀘스트 수행 시작하는 기능
     * 조건.
     * 1. 수행여부 조사
     * 2. Quest = create / questPool은 생성 X
     * 3. Quest-questPool만 연결하는 API만들기
     * 4.
     */
    $scope.startQuest = function(questPool){
      Notifier.confirm(questPool.title + "수행하시겠습니까? ", function(){
        var quest = {
          content : questPool.title + "수행하기.",
          user : $scope.currentUser._id,
          questPool : questPool
        };
        Quest.createQuest(quest, function(data){
          Notifier.message('quest가 등록 되었습니다.', function(){
            $window.location.reload();
          });
        });
      });
      console.log(questPool);
    };
  });
