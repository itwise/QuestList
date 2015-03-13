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
      return nowProgressQuestList;
    };


    /**
     * 퀘스트 수행랭킹 조회
     * 1. title 중복되지 말아야한다. (title - user) 로 연결되어있기 때문에
     * 2. count 조합하여 내림차순으로 보여준다.
     */
    $http.get('/api/questPools').success(function(questPools){
      var duplicationDataMap = new Map();
      var rankText = [];

      for(var i = 0; i < questPools.length; i++){
        duplicationDataMap.put(questPools[i].title, questPools[i].title);
      }

      duplicationDataMap.forEach(function(test){
        var testOb = {
          title : test,
          count : 0
        };
        rankText.push(testOb);
      });

      for(var i = 0; i < rankText.length  ; i++){
        for(var j = 0; j < questPools.length; j++){
          if(rankText[i].title === questPools[j].title){
            rankText[i].count +=     questPools[j].completeCount;
          }
        }
      }
      $scope.questPoolRank = rankText;

      $scope.questPoolRank.sort(function(a, b){
        return b.count - a.count;
      });

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
    };



    function Map() {

      this.dict = {};

      /**
       * Returns the number of key-value mappings in this map.
       * @method
       */
      this.size = function() {
        return Object.keys(this.dict).length;
      };

      /**
       * Returns true if this map contains no key-value mappings.
       * @method
       */
      this.isEmpty = function() {
        return Object.keys(this.dict).length == 0;
      };

      /**
       * Returns the value to which the specified key is mapped, or null if this map contains no mapping for the key.
       * @method
       */
      this.get = function(key){
        return this.dict[key];
      };

      /**
       * Returns true if this map contains a mapping for the specified key.
       * @method
       */
      this.containsKey = function(key){

        if( this.get(key) !== undefined) {
          return true;
        } else {
          return false;
        }

      };

      /**
       * Associates the specified value with the specified key in this map. If the map previously contained a mapping for the key, the old value is replaced.
       * @method
       */
      this.put = function(key,value) {
        this.dict[key] = value;
      };

      /**
       * Removes the mapping for the specified key from this map if present.
       * @method
       */
      this.remove = function(key) {
        'use strict';
        delete this.dict[key];
      };

      /**
       * Removes all of the mappings from this map. The map will be empty after this call returns.
       * @method
       */
      this.clear = function(){
        this.dict = {};
      };

      /**
       * Executes the given callback for each entry in this map until all entries have been processed.
       * The given callback will be passed a map entry as parameter. So, for example...
       *
       * function myCallback(mapEntryItem) {
	 * 		console.log('I will process this item: ' + mapEntryItem.text);
	 * }
       *
       * myMap.forEach(myCallback);
       *
       * @method
       */
      this.forEach = function(callback) {
        var len = this.size();
        for (var i = 0; i < len; i++) {
          var item = this.get( Object.keys(this.dict)[i] );
          callback(item);
        }
      }

    }
  });
