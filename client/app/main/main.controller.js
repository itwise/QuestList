'use strict';

angular.module('questApp')
  .controller('MainCtrl', function ($scope, Auth, $http, $window) {

    $http.get('/api/quests').success(function(data){
      console.log(data);
      $scope.questTimelines = data;
    });


    $scope.currentUser = Auth.getCurrentUser();

    $scope.nowProgressQuests = [

    ];

    $scope.processibleQuests = [

    ];

    $scope.addQuest = function(quest){

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

      console.log(quest);
     /* $http.post('/api/quests', quest).success(function(data, status, headers, config){
        $window.location.reload();
      }).error(function(data, status, headers, config){

      });*/
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
