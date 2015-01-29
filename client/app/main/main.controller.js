'use strict';

angular.module('questApp')
  .controller('MainCtrl', function ($scope, Auth, $http) {

    $http.get('/api/quests').success(function(data){
      console.log(data);
      $scope.questTimelines = data;
    });


    $scope.currentUser = Auth.getCurrentUser();

    $scope.nowProgressQuests = [

    ];

    $scope.processibleQuests = [

    ];

    $scope.addComment = function(questTimeline){
      var comment = {
        userName: 'TaeHee Kim',
        commentDate: new Date(),
        content: questTimeline.addTargetComment.content
      };

      questTimeline.comments.push(comment);
      questTimeline.addTargetComment = {};
    };

    $scope.addQuest = function(quest){
      $http.post('/api/quests', quest).success(function(data, status, headers, config){

      }).error(function(data, status, headers, config){

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
